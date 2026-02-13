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
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useAuth } from '../contexts/AuthContext'
import { saveFlow, loadFlow } from '../lib/flowPersistence'

// Configure PDF.js worker with local file
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

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
  const { user, signOut } = useAuth()
  
  // PDF import state
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfPassword, setPdfPassword] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importMessage, setImportMessage] = useState('')
  const [showPdfImport, setShowPdfImport] = useState(false)
  const fileInputRef = useRef(null)

  // Save/Load state
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

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

  // Auto-load user's flow on mount
  useEffect(() => {
    if (user?.id) {
      handleLoad()
    }
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

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
      // Allow negative flow to indicate deficit
      else if (node.data.nodeType === 'expense') {
        let incomingFlow = 0
        edges.forEach(edge => {
          if (edge.target === nodeId) {
            const sourceFlow = computeNodeFlow(edge.source, new Set(visited))
            incomingFlow += sourceFlow
            edgeFlows.set(edge.id, sourceFlow)
          }
        })
        flow = incomingFlow - (node.data.value || 0)
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
      
      // Calculate stroke width based on absolute flow value (min 2, max 6 for better visibility)
      const maxAbsFlow = Math.max(...Array.from(edgeFlows.values()).map(Math.abs), 1)
      const minWidth = 2
      const maxWidth = 6
      const strokeWidth = Math.max(minWidth, Math.min(maxWidth, (Math.abs(flowAmount) / maxAbsFlow) * maxWidth))
      
      // Determine color based on flow amount
      let strokeColor
      let markerEnd
      
      if (flowAmount > 0) {
        // Use a beautiful gradient-like effect with green shades for positive flow
        // Higher flow = brighter, more vibrant green
        const intensity = maxAbsFlow > 0 ? (flowAmount / maxAbsFlow) : 0.5
        
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
      } else if (flowAmount < 0) {
        // Red for negative flow (deficit)
        // Use red shades similar to expense nodes (#EF4444 to #DC2626)
        const intensity = maxAbsFlow > 0 ? (Math.abs(flowAmount) / maxAbsFlow) : 0.5
        
        const r = Math.round(239 - (239 - 220) * intensity)
        const g = Math.round(68 - (68 - 38) * intensity)
        const b = Math.round(68 - (68 - 38) * intensity)
        strokeColor = `rgb(${r}, ${g}, ${b})`
        
        // Add arrow marker for flow direction
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
        animated: flowAmount !== 0, // Animate edges with non-zero flow
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

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveMessage('')
      
      const cleanNodes = nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          // Remove function references before saving
          onValueChange: undefined,
          onLabelChange: undefined,
          customLabel: undefined,
        }
      }))

      const { data, error } = await saveFlow(user.id, cleanNodes, edges)
      
      if (error) {
        throw error
      }
      
      setSaveMessage('Flow saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error saving flow:', error)
      setSaveMessage('Error saving flow: ' + error.message)
      setTimeout(() => setSaveMessage(''), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoad = async () => {
    try {
      setIsLoading(true)
      setSaveMessage('')
      
      const { data, error } = await loadFlow(user.id)
      
      if (error) {
        throw error
      }
      
      if (!data || !data.nodes || data.nodes.length === 0) {
        setSaveMessage('No saved flow found')
        setTimeout(() => setSaveMessage(''), 3000)
        return
      }
      
      // Restore nodes with onValueChange and onLabelChange functions
      const restoredNodes = data.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onValueChange: handleValueChange,
          onLabelChange: handleLabelChange,
        }
      }))
      
      setNodes(restoredNodes)
      setEdges(data.edges || [])
      
      // Update nodeIdRef to be higher than any existing node ID
      const maxId = restoredNodes.reduce((max, node) => {
        const nodeNum = parseInt(node.id)
        return isNaN(nodeNum) ? max : Math.max(max, nodeNum)
      }, 0)
      nodeIdRef.current = maxId + 1
      
      setSaveMessage('Flow loaded successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error loading flow:', error)
      setSaveMessage('Error loading flow: ' + error.message)
      setTimeout(() => setSaveMessage(''), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Helper function to detect currency from text
  const detectCurrency = (text, amount) => {
    // Check for explicit CLP indicators first (highest priority)
    const clpIndicators = [
      /\bclp\b/i,
      /peso\s*chileno/i,
      /pesos\s*chilenos/i,
      /scotiabank\s*chile/i,
      /banco\s*de\s*chile/i,
      /\bchile\s+(bank|peso|pesos)\b/i,
    ]
    
    for (const pattern of clpIndicators) {
      if (pattern.test(text)) {
        return 'CLP'
      }
    }
    
    // Check for other specific currency codes/symbols
    // Note: $ is ambiguous - could be USD, CLP, CAD, AUD, etc.
    // Only match $ as USD if we don't have CLP context
    const currencyPatterns = [
      { pattern: /€|\bEUR\b/i, code: 'EUR' },
      { pattern: /£|\bGBP\b/i, code: 'GBP' },
      { pattern: /¥|\bJPY\b/i, code: 'JPY' },
      { pattern: /\bCNY\b/i, code: 'CNY' },
      { pattern: /\bCAD\b/i, code: 'CAD' },
      { pattern: /\bAUD\b/i, code: 'AUD' },
      { pattern: /\bCHF\b/i, code: 'CHF' },
      { pattern: /\bUSD\b/i, code: 'USD' },
    ]

    for (const { pattern, code } of currencyPatterns) {
      if (pattern.test(text)) {
        return code
      }
    }
    
    // If we see $ but no explicit USD marker, check for Chilean-specific context
    if (/\$/.test(text)) {
      const lowerText = text.toLowerCase()
      
      // Check for Chilean-specific payment terms or context
      const chileanTerms = [
        /información\s*de\s*pago/i, // "payment information" section header
        /scotiabank/i,
        /banco\s*de\s*chile/i,
      ]
      
      for (const pattern of chileanTerms) {
        if (pattern.test(lowerText)) {
          return 'CLP' // Strong Chilean context with $
        }
      }
      
      // Default $ to USD if no specific Chilean context
      return 'USD'
    }

    return 'USD' // Final fallback to USD
  }

  // Helper function to extract payment amounts from PDF text
  const extractPaymentAmounts = (text) => {
    const payments = []
    
    // Keywords that typically indicate payment amounts (English and Spanish)
    const keywords = [
      // English
      'payment due',
      'total payment',
      'amount due',
      'total due',
      'minimum payment',
      'new balance',
      'total balance',
      'payment amount',
      'amount owed',
      'current balance',
      'statement balance',
      // Spanish / Chilean
      'pago total',
      'pago mínimo',
      'saldo total',
      'saldo actual',
      'monto a pagar',
      'total a pagar',
      'importe total',
      'cuota',
      'monto total facturado',
      'monto mínimo a pagar',
      'monto total facturado a pagar',
      'información de pago',
    ]

    // Split text into lines for better processing
    const lines = text.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase()
      
      // Check if line contains a payment keyword
      const hasKeyword = keywords.some(keyword => line.includes(keyword))
      
      if (hasKeyword) {
        // Look for amounts in this line and nearby lines
        const searchText = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 3)).join(' ')
        
        // Match currency amounts with various formats
        // Supports: 1,234.56 | 1234.56 | 1.234,56 (European) | 2.130.004 (Chilean/pure thousands)
        const amountRegex = /(?:[\$€£¥]|\b)(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?|\d{1,3}(?:\.\d{3})+(?:,\d{2})?|\d{1,3}(?:\.\d{3})+)/g
        let match
        
        while ((match = amountRegex.exec(searchText)) !== null) {
          let amountStr = match[1].replace(/[\s]/g, '') // Remove spaces
          
          // Determine format based on separators and their positions
          const commaCount = (amountStr.match(/,/g) || []).length
          const dotCount = (amountStr.match(/\./g) || []).length
          
          let amount
          
          // Case 1: Pure thousands with dots (Chilean format like 2.130.004)
          // Multiple dots with 3-digit groups
          if (dotCount > 1 && commaCount === 0) {
            // Multiple dots: thousands separator format like 2.130.004 -> 2130004
            amount = parseFloat(amountStr.replace(/\./g, ''))
          }
          // Case 2: Single dot with 3 trailing digits - ambiguous case
          // Could be thousands (800.000 CLP) or decimal (123.456 USD)
          // Use amount magnitude as heuristic: large amounts likely use thousands separator
          else if (dotCount === 1 && commaCount === 0 && /\.\d{3}$/.test(amountStr)) {
            const baseAmount = parseFloat(amountStr.substring(0, amountStr.indexOf('.')))
            // If base amount is >= 100, more likely to be thousands separator
            if (baseAmount >= 100) {
              amount = parseFloat(amountStr.replace(/\./g, ''))
            } else {
              // Small base amount, treat as decimal
              amount = parseFloat(amountStr)
            }
          }
          // Case 3: US format with comma thousands and dot decimal (1,234.56)
          // Commas for thousands, dot for decimal (last part has 1-2 digits)
          else if (commaCount >= 1 && dotCount === 1 && /,\d{3}\.\d{1,2}$/.test(amountStr)) {
            // US format: 1,234.56 -> 1234.56
            amount = parseFloat(amountStr.replace(/,/g, ''))
          }
          // Case 4: European format with dot thousands and comma decimal (1.234,56)
          // Dots for thousands, comma for decimal (last part has 1-2 digits)
          else if (dotCount >= 1 && commaCount === 1 && /\.\d{3},\d{1,2}$/.test(amountStr)) {
            // European format: 1.234,56 -> 1234.56
            amount = parseFloat(amountStr.replace(/\./g, '').replace(',', '.'))
          }
          // Case 5: European format with only comma decimal (1234,56)
          else if (commaCount === 1 && dotCount === 0 && /,\d{1,2}$/.test(amountStr)) {
            // Could be European decimal: 1234,56 -> 1234.56
            amount = parseFloat(amountStr.replace(',', '.'))
          }
          // Case 6: US format with only comma thousands (1,234) or plain number
          else {
            // US format or plain: remove commas
            amount = parseFloat(amountStr.replace(/,/g, ''))
          }
          
          // Only include amounts that seem reasonable for credit card bills
          // Max amount set high to accommodate large CLP amounts
          const MAX_CREDIT_CARD_AMOUNT = 100000000 // 100 million in any currency
          if (!isNaN(amount) && amount > 10 && amount < MAX_CREDIT_CARD_AMOUNT) {
            const currency = detectCurrency(searchText, amount)
            payments.push({
              amount,
              currency,
              context: line.trim(),
            })
          }
        }
      }
    }

    // Remove duplicates and keep top 2 highest amounts
    const uniquePayments = []
    const seen = new Set()
    
    for (const payment of payments) {
      const key = `${payment.amount}-${payment.currency}`
      if (!seen.has(key)) {
        seen.add(key)
        uniquePayments.push(payment)
      }
    }

    // Sort by amount descending and take top 2
    return uniquePayments.sort((a, b) => b.amount - a.amount).slice(0, 2)
  }

  // Helper function to get FX rate from Frankfurter API
  const getFxRate = async (fromCurrency, toCurrency = 'USD') => {
    if (fromCurrency === toCurrency) {
      return { rate: 1, date: new Date().toISOString().split('T')[0] }
    }

    try {
      // Use latest endpoint for daily spot rate
      const response = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rate: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        rate: data.rates[toCurrency],
        date: data.date,
      }
    } catch (error) {
      throw new Error(`FX conversion failed: ${error.message}`)
    }
  }

  // Helper to close and reset PDF import panel
  const closePdfImport = () => {
    setShowPdfImport(false)
    setPdfFile(null)
    setPdfPassword('')
    setImportMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Main PDF import handler
  const handlePdfImport = async () => {
    if (!pdfFile) {
      setImportMessage('Please select a PDF file')
      return
    }

    // Validate file type
    if (!pdfFile.name.toLowerCase().endsWith('.pdf') || pdfFile.type !== 'application/pdf') {
      setImportMessage('Error: Please select a valid PDF file')
      return
    }

    setIsImporting(true)
    setImportMessage('Importing...')

    try {
      // Read PDF file as ArrayBuffer
      const arrayBuffer = await pdfFile.arrayBuffer()
      
      // Load PDF document
      let loadingTask
      try {
        loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          password: pdfPassword || undefined,
        })
        
        const pdf = await loadingTask.promise
        
        // Extract text from all pages
        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map(item => item.str).join(' ')
          fullText += pageText + '\n'
        }

        // Extract payment amounts
        const payments = extractPaymentAmounts(fullText)
        
        if (payments.length === 0) {
          setImportMessage('No payment amounts found in PDF')
          setIsImporting(false)
          return
        }

        // Convert to USD and sum
        let totalUsd = 0
        const conversions = []
        let fxDate = null

        for (const payment of payments) {
          const fxResult = await getFxRate(payment.currency, 'USD')
          const usdAmount = payment.amount * fxResult.rate
          totalUsd += usdAmount
          
          if (!fxDate) {
            fxDate = fxResult.date
          }

          conversions.push({
            original: payment.amount,
            currency: payment.currency,
            rate: fxResult.rate,
            usd: usdAmount,
          })
        }

        // Round to 2 decimals
        totalUsd = Math.round(totalUsd * 100) / 100

        // Find or create Credit Card Expense node
        let ccNode = nodes.find(n => n.data.importSource === 'credit-card-pdf')
        
        if (ccNode) {
          // Update existing node
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === ccNode.id) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    value: totalUsd,
                    onValueChange: handleValueChange,
                    onLabelChange: handleLabelChange,
                  },
                }
              }
              return node
            })
          )
        } else {
          // Create new node
          const newNode = {
            id: `${nodeIdRef.current++}`,
            type: 'editable',
            data: {
              label: 'Credit Card Expense',
              nodeType: 'expense',
              value: totalUsd,
              importSource: 'credit-card-pdf', // Marker for future updates
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
          
          // Store the new node ID for edge creation
          const newNodeId = newNode.id
          setNodes((nds) => nds.concat(newNode))
          ccNode = newNode

          // Create edge from node to main status node
          setEdges((eds) => {
            const edgeExists = eds.some(e => e.source === newNodeId && e.target === '1')
            if (!edgeExists) {
              return eds.concat({
                id: `e${newNodeId}-1`,
                source: newNodeId,
                target: '1',
                type: 'default',
              })
            }
            return eds
          })
        }

        // Show success message
        const successMsg = `Import successful!\n` +
          `Extracted ${payments.length} payment(s)\n` +
          `Total: $${totalUsd.toFixed(2)} USD` +
          (fxDate ? `\nFX Date: ${fxDate}` : '')
        
        setImportMessage(successMsg)
        
        // Clear after 5 seconds
        setTimeout(() => {
          setImportMessage('')
          setPdfFile(null)
          setPdfPassword('')
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }, 5000)

      } catch (pdfError) {
        if (pdfError.name === 'PasswordException') {
          setImportMessage('Wrong password. Please try again.')
          setIsImporting(false)
          return
        } else if (pdfError.name === 'InvalidPDFException') {
          setImportMessage('Invalid or corrupted PDF file. Please select a valid PDF.')
          setIsImporting(false)
          return
        } else {
          throw pdfError
        }
      }

    } catch (error) {
      console.error('PDF import error:', error)
      setImportMessage(`Error: ${error.message}`)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="w-full h-full relative">
      {/* Top bar with user info and logout */}
      <div className="absolute top-4 right-4 z-10 flex gap-3 items-center">
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <span className="text-gray-600">👤 {user?.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div className={`absolute top-20 right-4 z-10 px-4 py-2 rounded-lg shadow-lg text-sm ${
          saveMessage.includes('Error') 
            ? 'bg-red-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          {saveMessage}
        </div>
      )}

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
          disabled={isSaving}
          className={`px-4 py-2 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 ${
            isSaving 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSaving ? '⏳ Saving...' : '💾 Save'}
        </button>
        <button
          onClick={handleLoad}
          disabled={isLoading}
          className={`px-4 py-2 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 ${
            isLoading 
              ? 'bg-purple-400 cursor-not-allowed' 
              : 'bg-purple-500 hover:bg-purple-600'
          }`}
        >
          {isLoading ? '⏳ Loading...' : '📂 Load'}
          📂 Load
        </button>
        <button
          onClick={() => setShowPdfImport(!showPdfImport)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
        >
          📄 Import PDF
        </button>
      </div>

      {/* PDF Import Section */}
      {showPdfImport && (
        <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg" style={{ maxWidth: '350px' }}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold">Import Credit Card PDF</h3>
            <button
              onClick={closePdfImport}
              className="text-gray-500 hover:text-gray-700 font-bold text-lg leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          />
          <input
            type="password"
            placeholder="PDF Password (if needed)"
            value={pdfPassword}
            onChange={(e) => setPdfPassword(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          />
          <button
            onClick={handlePdfImport}
            disabled={isImporting || !pdfFile}
            className={`px-3 py-2 text-white font-semibold rounded-lg shadow transition-colors duration-200 text-sm ${
              isImporting || !pdfFile
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isImporting ? '⏳ Importing...' : '📄 Import PDF'}
          </button>
          {importMessage && (
            <div className={`text-xs p-2 rounded ${
              importMessage.includes('Error') || importMessage.includes('Wrong password') || importMessage.includes('No payment')
                ? 'bg-red-100 text-red-700'
                : importMessage.includes('successful')
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`} style={{ whiteSpace: 'pre-line' }}>
              {importMessage}
            </div>
          )}
        </div>
      </div>
      )}
      
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
