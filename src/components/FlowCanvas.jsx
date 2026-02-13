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
  const [isEditingValue, setIsEditingValue] = useState(false)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editValue, setEditValue] = useState(data.value || 0)
  const [editLabel, setEditLabel] = useState(data.label || '')
  const [showBreakdown, setShowBreakdown] = useState(false)

  const handleDoubleClickValue = () => {
    if (data.nodeType !== 'status') {
      setIsEditingValue(true)
    }
  }

  const handleDoubleClickLabel = (e) => {
    e.stopPropagation()
    if (data.nodeType !== 'status') {
      setIsEditingLabel(true)
    }
  }

  const handleStatusClick = () => {
    if (data.nodeType === 'status') {
      setShowBreakdown(!showBreakdown)
    }
  }

  const handleValueBlur = () => {
    setIsEditingValue(false)
    const numValue = parseFloat(editValue) || 0
    if (data.onValueChange) {
      data.onValueChange(id, numValue)
    }
  }

  const handleLabelBlur = () => {
    setIsEditingLabel(false)
    if (data.onLabelChange && editLabel.trim()) {
      data.onLabelChange(id, editLabel.trim())
    }
  }

  const handleValueKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleValueBlur()
    }
  }

  const handleLabelKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLabelBlur()
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

  const formatPercentage = (value, total) => {
    if (total === 0) return '0%'
    return ((value / total) * 100).toFixed(1) + '%'
  }

  const renderLabel = () => {
    if (data.nodeType === 'status') {
      const totalIncome = data.totalIncome || 0
      const totalExpenses = data.totalExpenses || 0
      const netValue = totalIncome - totalExpenses
      const netColorClass = netValue > 0 ? 'text-green-700' : netValue < 0 ? 'text-red-700' : 'text-gray-700'
      
      return (
        <div className="text-center" onClick={handleStatusClick}>
          <div className="font-bold text-lg cursor-pointer hover:text-blue-600">Financial Status</div>
          <div className="text-xs text-gray-600 mt-1">
            <div>Income: {formatCurrency(totalIncome)}</div>
            <div>Expenses: {formatCurrency(totalExpenses)}</div>
            <div className={`font-bold ${netColorClass} mt-1`}>
              Net: {formatCurrency(netValue)}
            </div>
          </div>
          {showBreakdown && (data.incomeBreakdown || data.expenseBreakdown) && (
            <div className="mt-2 text-xs border-t pt-2">
              {data.incomeBreakdown && data.incomeBreakdown.length > 0 && (
                <div className="mb-2">
                  <div className="font-semibold text-green-700">Income Sources:</div>
                  {data.incomeBreakdown.map((item, idx) => (
                    <div key={idx} className="text-left">
                      {item.label}: {formatCurrency(item.value)} ({formatPercentage(item.value, totalIncome)})
                    </div>
                  ))}
                </div>
              )}
              {data.expenseBreakdown && data.expenseBreakdown.length > 0 && (
                <div>
                  <div className="font-semibold text-red-700">Expenses:</div>
                  {data.expenseBreakdown.map((item, idx) => (
                    <div key={idx} className="text-left">
                      {item.label}: {formatCurrency(item.value)} ({formatPercentage(item.value, totalExpenses)})
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    const prefix = data.nodeType === 'income' ? '+' : '-'
    const colorClass = data.nodeType === 'income' ? 'text-green-700' : 'text-red-700'

    return (
      <div className="text-center">
        {isEditingLabel ? (
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={handleLabelBlur}
            onKeyDown={handleLabelKeyDown}
            className="text-sm font-semibold w-32 text-center border border-gray-300 rounded px-1"
            autoFocus
          />
        ) : (
          <div 
            className="font-semibold cursor-pointer hover:underline" 
            onDoubleClick={handleDoubleClickLabel}
          >
            {data.label || 'Node'}
          </div>
        )}
        {isEditingValue ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleValueBlur}
            onKeyDown={handleValueKeyDown}
            className="text-sm font-bold w-20 text-center border border-gray-300 rounded px-1"
            autoFocus
          />
        ) : (
          <div 
            className={`text-sm font-bold ${colorClass} cursor-pointer hover:underline`}
            onDoubleClick={handleDoubleClickValue}
          >
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
      value: 2950,
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
      value: 2250,
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
  {
    id: '4',
    type: 'editable',
    data: { 
      label: 'Freelance Work',
      nodeType: 'income',
      value: 1500,
    },
    position: { x: 400, y: 100 },
    style: {
      background: '#D1FAE5',
      border: '2px solid #10B981',
      borderRadius: '8px',
      padding: '12px',
      width: 150,
    },
  },
]

const initialEdges = [
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    type: 'default',
  },
  {
    id: 'e4-3',
    source: '4',
    target: '3',
    type: 'default',
  },
  {
    id: 'e3-1',
    source: '3',
    target: '1',
    type: 'default',
  },
]

const FlowCanvas = () => {
  const nodeIdRef = useRef(5)
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
              onLabelChange: handleLabelChange,
            },
          }
        }
        return {
          ...node,
          data: {
            ...node.data,
            onValueChange: handleValueChange,
            onLabelChange: handleLabelChange,
          },
        }
      })
    )
  }, [setNodes])

  // Handle label changes for nodes
  const handleLabelChange = useCallback((nodeId, newLabel) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel,
              onValueChange: handleValueChange,
              onLabelChange: handleLabelChange,
            },
          }
        }
        return node
      })
    )
  }, [setNodes, handleValueChange])

  // Add onValueChange and onLabelChange to all nodes on mount
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onValueChange: handleValueChange,
          onLabelChange: handleLabelChange,
        },
      }))
    )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate flow amounts through the network and update edge styles
  useEffect(() => {
    const mainStatusNode = nodes.find(n => n.id === '1')
    if (!mainStatusNode) return

    // Build adjacency map for flow computation
    const nodeMap = new Map()
    nodes.forEach(node => nodeMap.set(node.id, node))

    // Calculate flow for each edge by traversing from source nodes
    const edgeFlows = new Map()
    const nodeFlows = new Map() // Track computed flow at each node

    // Helper function to compute flow at a node (recursive with memoization)
    const computeNodeFlow = (nodeId, visited = new Set()) => {
      // Prevent cycles
      if (visited.has(nodeId)) return 0
      if (nodeFlows.has(nodeId)) return nodeFlows.get(nodeId)
      
      visited.add(nodeId)
      const node = nodeMap.get(nodeId)
      if (!node) return 0

      let flow = 0

      // For income nodes, flow is their value PLUS any incoming flows
      if (node.data.nodeType === 'income') {
        flow = node.data.value || 0
        // Add incoming flows from other income nodes (chained incomes)
        edges.forEach(edge => {
          if (edge.target === nodeId) {
            const sourceFlow = computeNodeFlow(edge.source, new Set(visited))
            flow += sourceFlow
            edgeFlows.set(edge.id, sourceFlow)
          }
        })
      }
      // For expense nodes, flow is sum of incoming flows minus their value
      else if (node.data.nodeType === 'expense') {
        let incomingFlow = 0
        edges.forEach(edge => {
          if (edge.target === nodeId) {
            const sourceFlow = computeNodeFlow(edge.source, new Set(visited))
            incomingFlow += sourceFlow
            edgeFlows.set(edge.id, sourceFlow)
          }
        })
        flow = Math.max(0, incomingFlow - (node.data.value || 0))
      }
      // For status node, sum all incoming flows
      else if (node.data.nodeType === 'status') {
        edges.forEach(edge => {
          if (edge.target === nodeId) {
            const sourceFlow = computeNodeFlow(edge.source, new Set(visited))
            flow += sourceFlow
            edgeFlows.set(edge.id, sourceFlow)
          }
        })
      }

      nodeFlows.set(nodeId, flow)
      return flow
    }

    // Compute flows for all nodes connected to status
    edges.forEach(edge => {
      if (!edgeFlows.has(edge.id)) {
        const sourceFlow = computeNodeFlow(edge.source)
        edgeFlows.set(edge.id, sourceFlow)
      }
    })

    // Calculate total income and expenses for status node based on flows
    let totalIncome = 0
    let totalExpenses = 0
    const incomeBreakdown = []
    const expenseBreakdown = []

    // Pre-compute set of connected node IDs for performance
    const connectedNodeIds = new Set()
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source)
      connectedNodeIds.add(edge.target)
    })

    // Calculate all original income sources (ONLY if connected)
    nodes.forEach(node => {
      if (node.data.nodeType === 'income' && connectedNodeIds.has(node.id)) {
        totalIncome += node.data.value || 0
      }
    })

    // Calculate all expenses that were deducted along the flow paths (ONLY if connected)
    nodes.forEach(node => {
      if (node.data.nodeType === 'expense' && connectedNodeIds.has(node.id)) {
        totalExpenses += node.data.value || 0
        expenseBreakdown.push({
          label: node.data.label || 'Expense',
          value: node.data.value || 0,
        })
      }
    })

    // Get breakdown from nodes directly connected to status (what flows into status)
    edges.forEach(edge => {
      if (edge.target === '1') {
        const sourceNode = nodeMap.get(edge.source)
        if (sourceNode) {
          const flowAmount = edgeFlows.get(edge.id) || 0
          if (sourceNode.data.nodeType === 'income') {
            incomeBreakdown.push({
              label: sourceNode.data.label || 'Income',
              value: flowAmount,
            })
          } else if (sourceNode.data.nodeType === 'expense') {
            // Flow coming from expense is net after deduction
            incomeBreakdown.push({
              label: `${sourceNode.data.label || 'Expense'} (net)`,
              value: flowAmount,
            })
          }
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
            incomeBreakdown,
            expenseBreakdown,
          },
        }
      }
      return node
    }))

    // Update edge styles based on flow amounts
    setEdges((eds) => eds.map(edge => {
      const flowAmount = edgeFlows.get(edge.id) || 0
      
      // Calculate stroke width based on flow (min 2, max 6 for better visibility)
      const maxFlow = Math.max(...Array.from(edgeFlows.values()), 1)
      const minWidth = 2
      const maxWidth = 6
      const strokeWidth = Math.max(minWidth, Math.min(maxWidth, (flowAmount / maxFlow) * maxWidth))
      
      // Determine color based on flow amount - use vibrant colors to showcase money flow
      let strokeColor
      let markerEnd
      
      if (flowAmount > 0) {
        // Use a beautiful gradient-like effect with green shades
        // Higher flow = brighter, more vibrant green
        const intensity = maxFlow > 0 ? (flowAmount / maxFlow) : 0.5
        
        // Beautiful vibrant green for money flow (#10B981 to #34D399)
        const r = Math.round(16 + (52 - 16) * intensity)
        const g = Math.round(185 + (211 - 185) * intensity)
        const b = Math.round(129 + (153 - 129) * intensity)
        strokeColor = `rgb(${r}, ${g}, ${b})`
        
        // Add arrow marker for flow direction (smaller size for better aesthetics)
        markerEnd = {
          type: 'arrowclosed',
          color: strokeColor,
          width: 12,
          height: 12,
        }
      } else {
        // Gray for zero flow
        strokeColor = '#D1D5DB'
        markerEnd = undefined
      }
      
      return { 
        ...edge, 
        style: { 
          stroke: strokeColor, 
          strokeWidth: strokeWidth,
          strokeLinecap: 'round',
        },
        animated: flowAmount > 0, // Animate edges with positive flow
        markerEnd: markerEnd,
        type: 'smoothstep', // Use smooth curved edges for better visual flow
      }
    }))
  }, [nodes, edges]) // Removed setEdges and setNodes as they are stable functions

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodesDelete = useCallback(
    (nodesToDelete) => {
      // Prevent deletion of the main status node
      const filteredNodes = nodesToDelete.filter(node => node.id !== '1')
      if (filteredNodes.length === 0) {
        if (nodesToDelete.some(node => node.id === '1')) {
          alert('Cannot delete the main status node')
        }
        return
      }
      // Edges will be automatically deleted by ReactFlow
    },
    []
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
        onLabelChange: handleLabelChange,
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
        onLabelChange: handleLabelChange,
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
        onLabelChange: handleLabelChange,
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
        onLabelChange: handleLabelChange,
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
        onLabelChange: handleLabelChange,
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
            onLabelChange: undefined,
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
      
      // Restore nodes with onValueChange and onLabelChange functions
      const restoredNodes = flowState.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onValueChange: handleValueChange,
          onLabelChange: handleLabelChange,
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
        onNodesDelete={onNodesDelete}
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
