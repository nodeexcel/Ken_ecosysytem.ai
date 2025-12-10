import { useMemo, useState } from 'react'
import { ArrowUp, Search } from 'lucide-react'
import ChatgptLogo from '../assets/svg/Chatgpt.svg'
import GeminiLogo from '../assets/svg/Gemini.svg'
import DeepseekLogo from '../assets/svg/Deepseek.svg'
import PerplexityLogo from '../assets/svg/Perplexity.svg'

const modelLogos = {
  ChatGPT: ChatgptLogo,
  Gemini: GeminiLogo,
  Deepseek: DeepseekLogo,
  Perplexity: PerplexityLogo,
}

const modelFilters = ['All Models', 'Chatgpt', 'Gemini', 'Perplexity', 'Deepseek']

function PromptAnalytics() {
  const [activeModel, setActiveModel] = useState('All Models')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedRows, setSelectedRows] = useState([])

  const tableData = [
    'Comment puis-je automatiser la prospection, la génération de leads et la création de contenu en l’intégrant mes outils actuels ?',
    'Comment puis-je automatiser la génération de leads et l’envoi d’e-mails en intégrant mes outils existants ?',
    'Comment puis-je automatiser la prospection et le suivi des leads en intégrant mes outils existants ?',
    'Comment puis-je automatiser la prospection, le suivi des leads et la création de contenu tout en l’intégrant à mes outils actuels ?',
    'Comment puis-je automatiser la génération de leads, la prospection et l’envoi d’e-mails en intégrant mes outils actuels ?',
    'Comment puis-je automatiser la génération de leads et l’envoi d’e-mails en intégrant mes outils actuels sans perdre en qualité ?',
    'Comment automatiser la génération de leads et l’envoi d’e-mails en intégrant mes outils actuels sans compromettre la personnalisation ?',
    'Comment automatiser la génération de leads et l’envoi d’e-mails en intégrant mes outils actuels sans perdre en efficacité ?',
  ].map((prompt, idx) => ({
    id: idx + 1,
    citedSource: prompt,
    models: ['ChatGPT', 'Gemini', 'Perplexity', 'Deepseek'],
    mentions: 0,
  }))

  const filteredData = useMemo(() => {
    let data = tableData
    if (activeModel !== 'All Models') {
      data = data.filter((row) =>
        row.models.some(
          (m) => m.toLowerCase() === activeModel.replace(/\s/g, '').toLowerCase()
        )
      )
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      data = data.filter((row) => row.citedSource.toLowerCase().includes(q))
    }
    return data
  }, [activeModel, searchQuery, tableData])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage))
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedRows.length === currentData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(currentData.map((row) => row.id))
    }
  }

  const allSelected =
    currentData.length > 0 && selectedRows.length === currentData.length

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows)
    setCurrentPage(1)
  }

  return (
    <div className="p-6 h-full overflow-auto flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-[600] text-[#1E1E1E]">Prompt Analytics</h1>
        <p className="text-sm text-[#5A687C]">
          See which prompts AI mentions your product in.
        </p>
      </div>

      {/* Model filters - slider style */}
      <div className="inline-flex items-center gap-1 bg-[#F3F4F6] rounded-xl p-1 w-fit">
        {modelFilters.map((label) => {
          const isActive = activeModel === label
          return (
            <button
              key={label}
              type="button"
              onClick={() => {
                setActiveModel(label)
                setCurrentPage(1)
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 cursor-pointer rounded-lg text-sm font-[600] transition-all ${
                isActive
                  ? 'bg-white text-[#111827] shadow-sm'
                  : 'bg-transparent text-[#6B7280]'
              }`}
            >
              {label === 'Chatgpt' && (
                <img src={ChatgptLogo} alt="Chatgpt" className="w-4 h-4" />
              )}
              {label === 'Gemini' && (
                <img src={GeminiLogo} alt="Gemini" className="w-4 h-4" />
              )}
              {label === 'Perplexity' && (
                <img src={PerplexityLogo} alt="Perplexity" className="w-4 h-4" />
              )}
              {label === 'Deepseek' && (
                <img src={DeepseekLogo} alt="Deepseek" className="w-4 h-4" />
              )}
              <span>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Search and Export All */}
      <div className="flex items-center gap-3 justify-between">
        {/* Export All Button */}
        

        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-[360px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A687C] w-4 h-4" />
          <input
            type="text"
            placeholder="Search name or phone number"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 border border-[#E1E4EA] rounded-lg bg-white focus:outline-none focus:border-[#675FFF] text-sm text-[#1E1E1E]"
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E1E4EA] rounded-lg hover:bg-[#F8F9FB] transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowUp className="w-4 h-4 " />
          <span className="text-sm font-[500] text-black">Export All</span>
        </button>
      </div>

      {/* Table with Pagination inside */}
      <div className="border border-[#E1E4EA] rounded-2xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#F7F7F8]">
              <tr>
                <th className="px-6 py-3 text-left text-[14px] font-[500] text-[#5A687C]">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 border border-[#D6D6D6] rounded cursor-pointer"
                    />
                    <span>Cited sources</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-[500] text-[#5A687C]">
                  Models
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-[500] text-[#5A687C]">
                  Categories
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E4EA]">
              {currentData.map((row) => (
                <tr key={row.id} className="hover:bg-[#F8F9FB] transition-colors">
                  <td className="px-6 py-4 text-[15px] text-[#1E1E1E] leading-6">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                        className="mt-1 w-4 h-4 border border-[#D6D6D6] rounded cursor-pointer flex-shrink-0"
                      />
                      <span>{row.citedSource}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {row.models.map((model, idx) => (
                        <img
                          key={idx}
                          src={modelLogos[model]}
                          alt={model}
                          className="w-5 h-5"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[15px] text-[#1E1E1E]">
                    {row.mentions} Mentions
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between bg-[#F7F7F8] px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ‹ Prev
            </button>
            {[currentPage - 1, currentPage, currentPage + 1]
              .filter((p) => p >= 1 && p <= totalPages)
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-lg px-3 py-1 text-sm min-w-[32px] ${
                    page === currentPage
                      ? 'bg-[#675FFF] text-white'
                      : 'border border-[#D6D6D6] text-[#000000] bg-white hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  {page}
                </button>
              ))}
            {totalPages > currentPage + 1 && <span className="text-[#000000] text-sm">…</span>}
            {totalPages > currentPage + 1 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white hover:bg-gray-50 cursor-pointer"
              >
                {totalPages}
              </button>
            )}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border border-[#D6D6D6] text-[#000000] rounded-lg px-3 py-1 text-sm bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next ›
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#5A687C]">
            <span>{rowsPerPage} rows</span>
            <button
              onClick={() => handleRowsPerPageChange(10)}
              className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] ${
                rowsPerPage === 10 ? 'bg-white' : 'bg-transparent hover:bg-white'
              } cursor-pointer`}
            >
              10
            </button>
            <button
              onClick={() => handleRowsPerPageChange(20)}
              className={`border border-[#D6D6D6] rounded-lg px-2 py-1 text-[#000000] ${
                rowsPerPage === 20 ? 'bg-white' : 'bg-transparent hover:bg-white'
              } cursor-pointer`}
            >
              20
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptAnalytics

