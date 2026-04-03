import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Upload, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { queryBasicInfoList, addBasicInfo, updateBasicInfo, deleteBasicInfo } from '../../api/services/sorting';
import { BasicInfoRecord } from '../../types/sorting';
import Modal from '../../components/common/Modal';
import { toast } from 'sonner';

const infoTypes = [
  '小区', '居民', '运营单位', '学校', '党政机关', 
  '医院', '商业综合体', '写字楼', '农贸市场', 
  '工作人员', '智能设备', '收集车辆'
];

const BasicInfo: React.FC = () => {
  const [activeType, setActiveType] = useState('小区');
  const [keyword, setKeyword] = useState('');
  const [records, setRecords] = useState<BasicInfoRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BasicInfoRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', address: '', manager: '', phone: '', status: '正常' });

  useEffect(() => {
    setPageNo(1);
    fetchData(1);
  }, [activeType]);

  const fetchData = async (page = pageNo) => {
    setLoading(true);
    try {
      const res = await queryBasicInfoList({ infoType: activeType, keyword, pageNo: page, pageSize });
      if (res.code === 0) {
        setRecords(res.data.list);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error('Failed to fetch basic info:', error);
      toast.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPageNo(newPage);
    fetchData(newPage);
  };

  const handleAdd = () => {
    setFormData({ name: '', address: '', manager: '', phone: '', status: '正常' });
    setIsAddModalOpen(true);
  };

  const handleEdit = (record: BasicInfoRecord) => {
    setSelectedRecord(record);
    setFormData({ name: record.name, address: record.address || '', manager: record.manager || '', phone: record.phone || '', status: record.status });
    setIsEditModalOpen(true);
  };

  const handleDelete = (record: BasicInfoRecord) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const submitForm = async () => {
    if (!formData.name) {
      toast.error('名称不能为空');
      return;
    }
    try {
      if (selectedRecord) {
        await updateBasicInfo({ ...selectedRecord, ...formData });
        toast.success('修改成功');
      } else {
        await addBasicInfo({ ...formData, type: activeType });
        toast.success('新增成功');
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to submit form:', error);
      toast.error('操作失败');
    }
  };

  const confirmDelete = async () => {
    if (!selectedRecord) return;
    try {
      await deleteBasicInfo(selectedRecord.id);
      toast.success('删除成功');
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to delete record:', error);
      toast.error('删除失败');
    }
  };

  const handleImport = () => {
    toast.info('正在打开导入窗口...');
  };

  const handleExport = () => {
    toast.success('数据导出成功');
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      {/* Sidebar for Info Types */}
      <div className="w-64 bg-white rounded-3xl shadow-sm border border-slate-100 p-4 flex flex-col overflow-y-auto">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">信息分类</h3>
        <div className="space-y-1">
          {infoTypes.map(type => (
            <button
              key={type}
              data-testid={`sorting-btn-type-${type}`}
              onClick={() => setActiveType(type)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                activeType === type 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {type}信息管理
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                data-testid="sorting-input-search"
                placeholder="搜索名称或负责人..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchData(1)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button
              onClick={() => fetchData(1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              查询
            </button>
            <button
              onClick={() => { setKeyword(''); fetchData(1); }}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              重置
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleAdd} data-testid="sorting-btn-add" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors">
              <Plus className="w-4 h-4" />
              新增
            </button>
            <button onClick={handleImport} data-testid="sorting-btn-import" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
              <Upload className="w-4 h-4" />
              批量导入
            </button>
            <button onClick={handleExport} data-testid="sorting-btn-export" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400">加载中...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-sm font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white">
                  <th className="p-4">编号</th>
                  <th className="p-4">名称</th>
                  <th className="p-4">地址</th>
                  <th className="p-4">负责人</th>
                  <th className="p-4">联系电话</th>
                  <th className="p-4">状态</th>
                  <th className="p-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-500 font-mono">{record.id}</td>
                    <td className="p-4 font-bold text-slate-900">{record.name}</td>
                    <td className="p-4 text-slate-600">{record.address || '-'}</td>
                    <td className="p-4 text-slate-600">{record.manager || '-'}</td>
                    <td className="p-4 text-slate-600">{record.phone || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        record.status === '正常' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(record)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="编辑">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(record)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="删除">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">暂无数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>共 {total} 条记录</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                disabled={pageNo === 1}
                onClick={() => handlePageChange(pageNo - 1)}
                className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-1 bg-slate-50 rounded-lg font-bold text-slate-900">
                {pageNo}
              </span>
              <button
                disabled={pageNo * pageSize >= total}
                onClick={() => handlePageChange(pageNo + 1)}
                className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <span>/ {Math.ceil(total / pageSize)} 页</span>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
        title={isAddModalOpen ? `新增${activeType}` : `编辑${activeType}`}
        footer={
          <>
            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold transition-colors">取消</button>
            <button onClick={submitForm} className="px-4 py-2 text-white bg-primary hover:bg-primary-hover rounded-xl text-sm font-bold transition-colors">确定</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">名称</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="请输入名称" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">地址</label>
            <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="请输入地址" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">负责人</label>
              <input type="text" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="请输入负责人" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">联系电话</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="请输入联系电话" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">状态</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="正常">正常</option>
              <option value="停用">停用</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="确认删除"
        footer={
          <>
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold transition-colors">取消</button>
            <button onClick={confirmDelete} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl text-sm font-bold transition-colors">确认删除</button>
          </>
        }
      >
        <p className="text-slate-600">您确定要删除 <span className="font-bold text-slate-900">{selectedRecord?.name}</span> 吗？此操作无法撤销。</p>
      </Modal>
    </div>
  );
};

export default BasicInfo;
