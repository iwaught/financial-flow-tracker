import React, { useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes = [
  {
    id: '1',
    type: 'default',
    data: { 
      label: (
        <div className="text-center">
          <div className="font-bold text-lg">Financial Status</div>
          <div className="text-sm text-gray-600">Central Hub</div>
        </div>
      ),
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
    type: 'default',
    data: { 
      label: (
        <div className="text-center">
          <div className="font-semibold">Work Income</div>
          <div className="text-sm font-bold text-green-700">+$3,500</div>
          <div className="text-xs text-gray-500">USD</div>
        </div>
      ),
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
    type: 'default',
    data: { 
      label: (
        <div className="text-center">
          <div className="font-semibold">Living Costs</div>
          <div className="text-sm font-bold text-red-700">-$2,200</div>
          <div className="text-xs text-gray-500">USD</div>
        </div>
      ),
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
  }, [nodes, edges, setEdges])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addIncomeNode = () => {
    const newNode = {
      id: `${nodeIdRef.current++}`,
      type: 'default',
      data: {
        label: (
          <div className="text-center">
            <div className="font-semibold">New Income</div>
            <div className="text-sm font-bold text-green-700">+$0</div>
            <div className="text-xs text-gray-500">USD</div>
          </div>
        ),
        nodeType: 'income',
        value: 0,
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
      type: 'default',
      data: {
        label: (
          <div className="text-center">
            <div className="font-semibold">Airbnb Revenue</div>
            <div className="text-sm font-bold text-green-700">$0</div>
            <div className="text-xs text-gray-500">USD</div>
          </div>
        ),
        nodeType: 'income',
        value: 0,
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
      type: 'default',
      data: {
        label: (
          <div className="text-center">
            <div className="font-semibold">Freelance Work</div>
            <div className="text-sm font-bold text-green-700">$0</div>
            <div className="text-xs text-gray-500">USD</div>
          </div>
        ),
        nodeType: 'income',
        value: 0,
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
      type: 'default',
      data: {
        label: (
          <div className="text-center">
            <div className="font-semibold">New Expense</div>
            <div className="text-sm font-bold text-red-700">-$0</div>
            <div className="text-xs text-gray-500">USD</div>
          </div>
        ),
        nodeType: 'expense',
        value: 0,
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
      type: 'default',
      data: {
        label: (
          <div className="text-center">
            <div className="font-semibold">Rent</div>
            <div className="text-sm font-bold text-red-700">$0</div>
            <div className="text-xs text-gray-500">USD</div>
          </div>
        ),
        nodeType: 'expense',
        value: 0,
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

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 flex gap-3">
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
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
