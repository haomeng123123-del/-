import React, { useState } from 'react';
import { Search, Plus, Settings, Play, Pause, AlertTriangle, CheckCircle, Clock, Truck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Mechanization: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([
    { id: 'MECH-202310-001', name: '延安中路高压冲洗', type: '高压冲洗', vehicle: '沪A·A1234', driver: '张师傅', progress: 85, status: 'active', time: '05:00 - 08:00' },
    { id: 'MECH-202310-002', name: '南京西路机扫作业', type: '机扫作业', vehicle: '沪A·B5678', driver: '李师傅', progress: 100, status: 'completed', time: '22:00 - 02:00' },
    { id: 'MECH-202310-003', name: '静安寺商圈雾炮降尘', type: '雾炮降尘', vehicle: '沪A·C9012', driver: '王师傅', progress: 30, status: 'active', time: '09:00 - 11:30' },
    { id: 'MECH-202310-004', name: '武宁南路洒水作业', type: '洒水作业', vehicle: '沪A·D3456', driver: '赵师傅', progress: 0, status: 'pending', time: '13:00 - 15:00' },
    { id: 'MECH-202310-005', name: '常德路护栏清洗', type: '护栏清洗', vehicle: '沪A·E7890', driver: '孙师傅', progress: 0, status: 'pending', time: '08:00 - 18:00' },
  ]);

  const filteredTasks = tasks.filter(t => t.name.includes(search) || t.type.includes(search));

  const handleAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-headline text-slate-900 tracking-tight">机械化作业管理</h1>
          <p className="text-slate-500 mt-1">机扫、冲洗、洒水等机械化作业任务监控</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-80 focus:ring-2 focus:ring-primary/20 shadow-sm"
              placeholder="搜索任务名称或类型..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="mechanization-input-search"
            />
            <Search className="absolute right-4 top-3 w-4 h-4 text-slate-400" />
          </div>
          <button 
            onClick={handleAdd}
            className="bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 font-bold text-sm"
            data-testid="mechanization-btn-add"
          >
            <Plus className="w-4 h-4" />
            下发任务
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">今日作业车辆</p>
            <p className="text-3xl font-black text-slate-800 font-headline">35 <span className="text-sm text-slate-400 font-normal">辆</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">任务完成率</p>
            <p className="text-3xl font-black text-slate-800 font-headline">82.5 <span className="text-sm text-slate-400 font-normal">%</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">作业异常</p>
            <p className="text-3xl font-black text-slate-800 font-headline">2 <span className="text-sm text-slate-400 font-normal">起</span></p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" data-testid="mechanization-table-list">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 font-bold text-slate-500 text-sm">任务编号</th>
                <th className="p-4 font-bold text-slate-500 text-sm">任务名称</th>
                <th className="p-4 font-bold text-slate-500 text-sm">作业类型</th>
                <th className="p-4 font-bold text-slate-500 text-sm">执行车辆/人员</th>
                <th className="p-4 font-bold text-slate-500 text-sm">作业时间</th>
                <th className="p-4 font-bold text-slate-500 text-sm w-48">进度</th>
                <th className="p-4 font-bold text-slate-500 text-sm">状态</th>
                <th className="p-4 font-bold text-slate-500 text-sm text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-500">{task.id}</td>
                  <td className="p-4 font-bold text-slate-900">{task.name}</td>
                  <td className="p-4">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-blue-50 text-blue-700">
                      {task.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div 
                      className="text-sm font-bold text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate('/vehicles/info')}
                    >
                      {task.vehicle}
                    </div>
                    <div 
                      className="text-xs text-slate-500 cursor-pointer hover:text-blue-600 hover:underline"
                      onClick={() => navigate('/personnel/info')}
                    >
                      {task.driver}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {task.time}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-8">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 w-fit ${
                      task.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {task.status === 'active' ? '作业中' : task.status === 'completed' ? '已完成' : '待开始'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {task.status === 'active' ? (
                        <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="暂停">
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : task.status === 'pending' ? (
                        <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="开始">
                          <Play className="w-4 h-4" />
                        </button>
                      ) : null}
                      <button 
                        onClick={() => handleEdit(task)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" 
                        title="设置"
                        data-testid={`mechanization-btn-edit-${task.id}`}
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">没有找到匹配的任务</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">{editingTask ? '任务设置' : '下发新任务'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">任务名称</label>
                  <input 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="请输入任务名称"
                    defaultValue={editingTask?.name}
                    data-testid="mechanization-modal-input-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">作业类型</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    defaultValue={editingTask?.type}
                    data-testid="mechanization-modal-select-type"
                  >
                    <option value="">请选择作业类型</option>
                    <option value="高压冲洗">高压冲洗</option>
                    <option value="机扫作业">机扫作业</option>
                    <option value="雾炮降尘">雾炮降尘</option>
                    <option value="洒水作业">洒水作业</option>
                    <option value="护栏清洗">护栏清洗</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">执行车辆</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    defaultValue={editingTask?.vehicle}
                    data-testid="mechanization-modal-select-vehicle"
                  >
                    <option value="">请选择车辆</option>
                    <option value="沪A·A1234">沪A·A1234</option>
                    <option value="沪A·B5678">沪A·B5678</option>
                    <option value="沪A·C9012">沪A·C9012</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">执行人员</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    defaultValue={editingTask?.driver}
                    data-testid="mechanization-modal-select-driver"
                  >
                    <option value="">请选择人员</option>
                    <option value="张师傅">张师傅</option>
                    <option value="李师傅">李师傅</option>
                    <option value="王师傅">王师傅</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">作业时间段</label>
                  <div className="flex items-center gap-2">
                    <input type="time" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                    <span className="text-slate-400">-</span>
                    <input type="time" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">任务状态</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                    defaultValue={editingTask?.status || 'pending'}
                    data-testid="mechanization-modal-select-status"
                  >
                    <option value="pending">待开始</option>
                    <option value="active">作业中</option>
                    <option value="completed">已完成</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-colors"
                  data-testid="mechanization-modal-btn-submit"
                >
                  确认下发
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mechanization;
