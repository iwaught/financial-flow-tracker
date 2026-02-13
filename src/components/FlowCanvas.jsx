import React, { useCallback, useRef, useEffect, useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'

// Custom node component with editable value
const EditableNode = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(data.value || 0)

  const handleDoubleClick = () => {
    if (data.nodeType !== 'status') {
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    const numValue = parseFloat(editValue) || 0
    if (data.onValueChange) {
      data.onValueChange(id, numValue)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur()
    }
  }

  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  const renderLabel = () => {
    if (data.nodeType === 'status') {
      const totalIncome = data.totalIncome || 0
      const totalExpenses = data.totalExpenses || 0
      const netValue = totalIncome - totalExpenses
      const netColorClass = netValue > 0 ? 'text-green-700' : netValue < 0 ? 'text-red-700' : 'text-gray-700'
      
      return (
        <div className="text-center">
          <div className="font-bold text-lg">Financial Status</div>
          <div className="text-xs text-gray-600 mt-1">
            <div>Income: {formatCurrency(totalIncome)}</div>
            <div>Expenses: {formatCurrency(totalExpenses)}</div>
            <div className={`font-bold ${netColorClass} mt-1`}>
              Net: {formatCurrency(netValue)}
            </div>
          </div>
        </div>
      )
    }

    const prefix = data.nodeType === 'income' ? '+' : '-'
    const colorClass = data.nodeType === 'income' ? 'text-green-700' : 'text-red-700'

    return (
      <div className="text-center" onDoubleClick={handleDoubleClick}>
        <div className="font-semibold">{data.label || 'Node'}</div>
        {isEditing ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="text-sm font-bold w-20 text-center border border-gray-300 rounded px-1"
            autoFocus
          />
        ) : (
          <div className={`text-sm font-bold ${colorClass} cursor-pointer hover:underline`}>
            {formatCurrency(data.value || 0)}
          </div>
        )}
        <div className="text-xs text-gray-500">USD</div>
      </div>
    )
  }

  return (
    <div>
      <Handle type="target" position={Position.Left} />
      {renderLabel()}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

const nodeTypes = {
  editable: EditableNode,
}

const initialNodes = [
  {
    id: '1',
    type: 'editable',
    data: { 
      nodeType: 'status',
      value: 0,
    },
    position: { x: 400, y: 200 },
    style: {
      background: '#E0F2FE',
      border: '2px solid #0284C7',
      borderRadius: '8px',
      padding: '15px',
      width: 200,
    },
  },
  {
    id: '2',
    type: 'editable',
    data: { 
      label: 'Work Income',
      nodeType: 'income',
      value: 3500,
    },
    position: { x: 100, y: 100 },
    style: {
      background: '#D1FAE5',
      border: '2px solid #10B981',
      borderRadius: '8px',
      padding: '12px',
      width: 150,
    },
  },
  {
    id: '3',
    type: 'editable',
    data: { 
      label: 'Living Costs',
      nodeType: 'expense',
      value: 2200,
    },
    position: { x: 700, y: 100 },
    style: {
      background: '#FEE2E2',
      border: '2px solid #EF4444',
      borderRadius: '8px',
      padding: '12px',
      width: 150,
    },
  },
]

const initialEdges = []

const FlowCanvas = () => {
  const nodeIdRef = useRef(4)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Handle value changes for nodes
  const handleValueChange = useCallback((nodeId, newValue) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              value: newValue,
              onValueChange: handleValueChange,
            },
          }
        }
        return {
          ...node,
          data: {
            ...node.data,
            onValueChange: handleValueChange,
          },
        }
      })
    )
  }, [setNodes])

  // Add onValueChange to all nodes on mount
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onValueChange: handleValueChange,
        },
      }))
    )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate net value and update edge colors
  useEffect(() => {
    const mainStatusNode = nodes.find(n => n.id === '1')
    if (!mainStatusNode) return

    // Calculate total income from nodes connected TO the main status
    let totalIncome = 0
    edges.forEach(edge => {
      if (edge.target === '1') {
        const sourceNode = nodes.find(n => n.id === edge.source)
        if (sourceNode?.data?.nodeType === 'income') {
          totalIncome += sourceNode.data.value || 0
        }
      }
    })

    // Calculate total expenses from nodes connected FROM the main status
    let totalExpenses = 0
    edges.forEach(edge => {
      if (edge.source === '1') {
        const targetNode = nodes.find(n => n.id === edge.target)
        if (targetNode?.data?.nodeType === 'expense') {
          totalExpenses += targetNode.data.value || 0
        }
      }
    })

    const netValue = totalIncome - totalExpenses

    // Update main status node with calculated values
    setNodes((nds) => nds.map(node => {
      if (node.id === '1') {
        return {
          ...node,
          data: {
            ...node.data,
            totalIncome,
            totalExpenses,
          },
        }
      }
      return node
    }))

    // Update edge colors based on net value
    setEdges((eds) => eds.map(edge => {
      // Color edges from main status to expenses based on net value
      if (edge.source === '1') {
        const targetNode = nodes.find(n => n.id === edge.target)
        if (targetNode?.data?.nodeType === 'expense') {
          if (netValue > 0) {
            return { ...edge, style: { stroke: '#10B981', strokeWidth: 2 } }
          } else if (netValue < 0) {
            return { ...edge, style: { stroke: '#EF4444', strokeWidth: 2 } }
          } else {
            return { ...edge, style: { stroke: '#6B7280', strokeWidth: 2 } }
          }
        }
      }
      // Income edges stay green
      if (edge.target === '1') {
        const sourceNode = nodes.find(n => n.id === edge.source)
        if (sourceNode?.data?.nodeType === 'income') {
          return { ...edge, style: { stroke: '#10B981', strokeWidth: 2 } }
        }
      }
      return edge
    }))
  }, [nodes, edges, setEdges, setNodes])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addIncomeNode = () => {
    const newNode = {
      id: `${nodeIdRef.current++}`,
      type: 'editable',
      data: {
        label: 'New Income',
        nodeType: 'income',
        value: 0,
        onValueChange: handleValueChange,
      },
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
      },
      style: {
        background: '#D1FAE5',
        border: '2px solid #10B981',
        borderRadius: '8px',
        padding: '12px',
        width: 150,
      },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const addAirbnbIncomeNode = () => {
    const newNode = {
      id: `${nodeIdRef.current++}`,
      type: 'editable',
      data: {
        label: 'Airbnb Revenue',
        nodeType: 'income',
        value: 0,
        onValueChange: handleValueChange,
      },
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
      },
      style: {
        background: '#D1FAE5',
        border: '2px solid #10B981',
        borderRadius: '8px',
        padding: '12px',
        width: 150,
      },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const addFreelanceIncomeNode = () => {
    const newNode = {
      id: `${nodeIdRef.current++}`,
      type: 'editable',
      data: {
        label: 'Freelance Work',
        nodeType: 'income',
        value: 0,
        onValueChange: handleValueChange,
      },
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
      },
      style: {
        background: '#D1FAE5',
        border: '2px solid #10B981',
        borderRadius: '8px',
        padding: '12px',
        width: 150,
      },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const addExpenseNode = () => {
    const newNode = {
      id: `${nodeIdRef.current++}`,
      type: 'editable',
      data: {
        label: 'New Expense',
        nodeType: 'expense',
        value: 0,
        onValueChange: handleValueChange,
      },
      position: {
        x: Math.random() * 300 + 600,
        y: Math.random() * 300 + 50,
      },
      style: {
        background: '#FEE2E2',
        border: '2px solid #EF4444',
        borderRadius: '8px',
        padding: '12px',
        width: 150,
      },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const addRentExpenseNode = () => {
    const newNode = {
      id: `${nodeIdRef.current++}`,
      type: 'editable',
      data: {
        label: 'Rent',
        nodeType: 'expense',
        value: 0,
        onValueChange: handleValueChange,
      },
      position: {
        x: Math.random() * 300 + 600,
        y: Math.random() * 300 + 50,
      },
      style: {
        background: '#FEE2E2',
        border: '2px solid #EF4444',
        borderRadius: '8px',
        padding: '12px',
        width: 150,
      },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const handleSave = () => {
    try {
      const flowState = {
        nodes: nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            // Remove function references before saving
            onValueChange: undefined,
            customLabel: undefined,
          }
        })),
        edges,
        nodeIdCounter: nodeIdRef.current,
      }
      localStorage.setItem('financial-flow-state', JSON.stringify(flowState))
      alert('Flow saved successfully!')
    } catch (error) {
      alert('Error saving flow: ' + error.message)
    }
  }

  const handleLoad = () => {
    try {
      const saved = localStorage.getItem('financial-flow-state')
      if (!saved) {
        alert('No saved flow found')
        return
      }
      
      const flowState = JSON.parse(saved)
      
      // Restore nodes with onValueChange function
      const restoredNodes = flowState.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onValueChange: handleValueChange,
        }
      }))
      
      setNodes(restoredNodes)
      setEdges(flowState.edges || [])
      if (flowState.nodeIdCounter) {
        nodeIdRef.current = flowState.nodeIdCounter
      }
      
      alert('Flow loaded successfully!')
    } catch (error) {
      alert('Error loading flow: ' + error.message)
    }
  }

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 flex gap-3 flex-wrap">
        <button
          onClick={addAirbnbIncomeNode}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          + Add Airbnb Income
        </button>
        <button
          onClick={addFreelanceIncomeNode}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          + Add Freelance Income
        </button>
        <button
          onClick={addIncomeNode}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          + Add Income
        </button>
        <button
          onClick={addRentExpenseNode}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          + Add Rent Expense
        </button>
        <button
          onClick={addExpenseNode}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          + Add Expense
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          💾 Save
        </button>
        <button
          onClick={handleLoad}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          📂 Load
        </button>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.data?.nodeType === 'income') return '#10B981'
            if (node.data?.nodeType === 'expense') return '#EF4444'
            return '#0284C7'
          }}
          style={{
            backgroundColor: '#F9FAFB',
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}

export default FlowCanvas
