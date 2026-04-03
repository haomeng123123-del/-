import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Edit2, Trash2, X, UserCheck, MapPin, Video, Navigation } from 'lucide-react';

const PersonnelInfo: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState('');
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const [personnelData, setPersonnelData] = useState([
    { id: 'HW-2023-045', name: '张建国', gender: '男', age: 45, role: '清扫工', dept: '静安寺班组', phone: '13800138001', status: '在职', joinDate: '2018-05-12' },
    { id: 'HW-2023-046', name: '李明', gender: '男', age: 38, role: '巡查员', dept: '南京西路班组', phone: '13900139002', status: '在职', joinDate: '2020-11-05' },
    { id: 'HW-2023-047', name: '王秀英', gender: '女', age: 52, role: '清扫工', dept: '静安寺班组', phone: '13700137003', status: '在职', joinDate: '2015-03-20' },
    { id: 'HW-2023-048', name: '赵铁柱', gender: '男', age: 41, role: '清运司机', dept: '运输车队', phone: '13600136004', status: '离职', joinDate: '2019-08-15' },
    { id: 'HW-2023-049', name: '刘伟', gender: '男', age: 35, role: '管理人员', dept: '静安寺班组', phone: '13500135005', status: '在职', joinDate: '2021-02-10' },
    { id: 'HW-2023-050', name: '陈芳', gender: '女', age: 48, role: '清扫工', dept: '曹家渡班组', phone: '13400134006', status: '在职', joinDate: '2017-09-01' },
    { id: 'HW-2023-051', name: '杨强', gender: '男', age: 50, role: '清扫工', dept: '南京西路班组', phone: '13300133007', status: '在职', joinDate: '2016-06-18' },
    { id: 'HW-2023-052', name: '吴磊', gender: '男', age: 32, role: '巡查员', dept: '江宁路班组', phone: '13200132008', status: '在职', joinDate: '2022-04-25' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: '', name: '', gender: '男', age: 30, role: '清扫工', dept: '静安寺班组', phone: '', status: '在职', joinDate: new Date().toISOString().split('T')[0]
  });

  const filteredData = personnelData.filter(person => {
    const matchesSearch = person.name.includes(search) || person.phone.includes(search) || person.id.includes(search);
    const matchesRole = roleFilter === 'all' || person.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = (action: string) => {
    setShowToast(action);
    setTimeout(() => setShowToast(''), 3000);
  };

  const openModal = (person: any = null) => {
    if (person) {
      setEditingPerson(person);
      setFormData(person);
    } else {
      setEditingPerson(null);
      setFormData({
        id: `HW-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`, 
        name: '', gender: '男', age: 30, role: '清扫工', dept: '静安寺班组', phone: '', status: '在职', joinDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPerson) {
      setPersonnelData(personnelData.map(p => p.id === formData.id ? formData : p));
      handleAction(`已更新人员: ${formData.name}`);
    } else {
      setPersonnelData([formData, ...personnelData]);
      handleAction(`已新增人员: ${formData.name}`);
    }
    closeModal();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`确定要删除人员 ${name} 吗？`)) {
      setPersonnelData(personnelData.filter(p => p.id !== id));
      handleAction(`已删除人员: ${name}`);
      const newTotalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          <span className="font-bold">{showToast}</span>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">{editingPerson ? '编辑人员信息' : '新增环卫人员'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">工号</label>
                  <input type="text" value={formData.id} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">姓名</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" placeholder="输入姓名" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">性别</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20">
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">年龄</label>
                  <input type="number" required min="18" max="70" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">岗位</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20">
                    <option value="清扫工">清扫工</option>
                    <option value="巡查员">巡查员</option>
                    <option value="清运司机">清运司机</option>
                    <option value="管理人员">管理人员</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">所属部门</label>
                  <select value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20">
                    <option value="静安寺班组">静安寺班组</option>
                    <option value="南京西路班组">南京西路班组</option>
                    <option value="曹家渡班组">曹家渡班组</option>
                    <option value="江宁路班组">江宁路班组</option>
                    <option value="运输车队">运输车队</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">联系电话</label>
                  <input type="tel" required pattern="[0-9]{11}" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" placeholder="11位手机号" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">入职日期</label>
                  <input type="date" required value={formData.joinDate} onChange={e => setFormData({...formData, joinDate: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">状态</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20">
                    <option value="在职">在职</option>
                    <option value="离职">离职</option>
                    <option value="休假">休假</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-container transition-colors shadow-md">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">人员信息管理</h1>
          <p className="text-slate-500 mt-1">管理环卫人员基本信息、岗位及部门归属</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-80 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="搜索姓名、工号或手机号..."
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
            <Search className="absolute right-4 top-3 w-4 h-4 text-slate-400" />
          </div>
          <div className="relative">
            <select 
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm appearance-none pr-10 focus:ring-2 focus:ring-primary/20 shadow-sm"
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">全部岗位</option>
              <option value="清扫工">清扫工</option>
              <option value="巡查员">巡查员</option>
              <option value="清运司机">清运司机</option>
              <option value="管理人员">管理人员</option>
            </select>
            <Filter className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <button onClick={() => openModal()} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            新增人员
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-bold">工号</th>
                <th className="p-4 font-bold">姓名</th>
                <th className="p-4 font-bold">性别/年龄</th>
                <th className="p-4 font-bold">岗位</th>
                <th className="p-4 font-bold">所属部门</th>
                <th className="p-4 font-bold">联系电话</th>
                <th className="p-4 font-bold">入职日期</th>
                <th className="p-4 font-bold">状态</th>
                <th className="p-4 font-bold text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-600">{row.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {row.name[0]}
                      </div>
                      <span className="font-bold text-slate-800">{row.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{row.gender} / {row.age}岁</td>
                  <td className="p-4 text-sm text-slate-600">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold">{row.role}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{row.dept}</td>
                  <td className="p-4 text-sm text-slate-600 font-mono">{row.phone}</td>
                  <td className="p-4 text-sm text-slate-600">{row.joinDate}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.status === '在职' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate('/personnel/track-realtime')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="实时轨迹">
                        <MapPin className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate('/personnel/track-history')} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="历史轨迹">
                        <Navigation className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal(row)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="编辑">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(row.id, row.name)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    没有找到匹配的人员信息
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/30 mt-auto">
          <span className="text-sm text-slate-500">共 {filteredData.length} 条记录</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || totalPages === 0}
              className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              上一页
            </button>
            <span className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">
              {totalPages === 0 ? 0 : currentPage} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonnelInfo;
