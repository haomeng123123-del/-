import React, { useState, useEffect } from 'react';
import { queryReportList, addReport, updateReport, deleteReport } from '../../api/services/sorting';
import { ReportRecord } from '../../types/sorting';
import { Search, Plus, FileText, Download, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../components/common/Modal';

const OnlineReport: React.FC = () => {
  const [data, setData] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ReportRecord | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    reportDate: '',
    category: '厨余垃圾',
    weight: 0,
    reporter: '管理员',
    status: 'draft'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryReportList({ 
        keyword: startDate || endDate ? `${startDate}至${endDate}` : undefined, 
        status, 
        pageNo, 
        pageSize: 10 
      });
      if (res.code === 0) {
        setData(res.data.list);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      toast.error('获取填报记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNo, status]);

  const handleAdd = () => {
    setCurrentRecord(null);
    setFormData({
      reportDate: new Date().toISOString().split('T')[0],
      category: '厨余垃圾',
      weight: 0,
      reporter: '管理员',
      status: 'draft'
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = (record: ReportRecord) => {
    setCurrentRecord(record);
    setFormData({
      reportDate: record.reportDate,
      category: record.category,
      weight: record.weight,
      reporter: record.reporter,
      status: record.status
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (record: ReportRecord) => {
    setCurrentRecord(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentRecord) return;
    try {
      const res = await deleteReport(currentRecord.id);
      if (res.code === 0) {
        toast.success('已删除填报记录');
        setIsDeleteModalOpen(false);
        fetchData();
      }
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentRecord) {
        await updateReport({ ...currentRecord, ...formData });
        toast.success('修改成功');
      } else {
        await addReport({ ...formData, status: 'submitted' });
        toast.success('填报提交成功');
      }
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const handleExport = () => {
    toast.success('导出任务已提交');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">日期范围:</span>
            <input
              type="date"
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">所有状态</option>
            <option value="draft">暂存</option>
            <option value="submitted">已提交</option>
          </select>
          <button
            onClick={() => { setPageNo(1); fetchData(); }}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
            data-testid="sorting-btn-search-report"
          >
            查询
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> 新增填报
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-500 text-white rounded-lg text-sm font-bold hover:bg-slate-600 transition-colors"
          >
            <Download className="w-4 h-4" /> 导出记录
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm" data-testid="sorting-table-report">
          <thead className="bg-slate-50 border-bottom border-slate-100">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-600">填报编号</th>
              <th className="px-6 py-4 font-bold text-slate-600">填报日期</th>
              <th className="px-6 py-4 font-bold text-slate-600">填报人</th>
              <th className="px-6 py-4 font-bold text-slate-600">垃圾种类</th>
              <th className="px-6 py-4 font-bold text-slate-600">重量 (kg)</th>
              <th className="px-6 py-4 font-bold text-slate-600">状态</th>
              <th className="px-6 py-4 font-bold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">加载中...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">暂无数据</td></tr>
            ) : data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.id}</td>
                <td className="px-6 py-4 text-slate-900">{item.reportDate}</td>
                <td className="px-6 py-4 text-slate-500">{item.reporter}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.category === '厨余垃圾' ? 'bg-emerald-100 text-emerald-700' : 
                    item.category === '其他垃圾' ? 'bg-slate-100 text-slate-700' : 
                    item.category === '可回收物' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{item.weight}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'submitted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status === 'submitted' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {item.status === 'submitted' ? '已提交' : '暂存'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item)}
                      className="text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>共 {total} 条记录</span>
          <div className="flex gap-2">
            <button 
              disabled={pageNo === 1}
              onClick={() => setPageNo(p => p - 1)}
              className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
            >
              上一页
            </button>
            <button 
              disabled={pageNo * 10 >= total}
              onClick={() => setPageNo(p => p + 1)}
              className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={currentRecord ? '编辑填报信息' : '新增填报'}
        footer={
          <>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-bold transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              提交填报
            </button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSave}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">填报日期</label>
            <input 
              type="date" 
              value={formData.reportDate}
              onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">垃圾种类</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="可回收物">可回收物</option>
                <option value="厨余垃圾">厨余垃圾</option>
                <option value="有害垃圾">有害垃圾</option>
                <option value="其他垃圾">其他垃圾</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">重量 (kg)</label>
              <input 
                type="number" 
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="请输入重量"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">填报人</label>
            <input 
              type="text" 
              value={formData.reporter}
              onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="确认删除"
        footer={
          <>
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-bold transition-colors"
            >
              取消
            </button>
            <button 
              onClick={confirmDelete}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 transition-colors"
            >
              确认删除
            </button>
          </>
        }
      >
        <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
          <AlertCircle className="w-8 h-8 text-rose-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-rose-900">确定要删除该填报记录吗？</p>
            <p className="text-xs text-rose-700 mt-1">此操作不可撤销。</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OnlineReport;
