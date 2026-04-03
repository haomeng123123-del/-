import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Search, CheckCircle2, XCircle, Lock, ChevronRight } from 'lucide-react';
import { queryRoles } from '../../api/services/platform';
import { RoleInfo } from '../../types/platform';

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<RoleInfo | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryRoles();
      setRoles(res.data);
      if (res.data.length > 0) setSelectedRole(res.data[0]);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const permissions = [
    { id: 'all', label: '全部权限', module: '系统' },
    { id: 'data_view', label: '数据查看', module: '数据' },
    { id: 'data_edit', label: '数据编辑', module: '数据' },
    { id: 'oper_manage', label: '运营管理', module: '业务' },
    { id: 'team_manage', label: '队伍管理', module: '人员' },
    { id: 'track_view', label: '轨迹查看', module: '人员' },
    { id: 'sys_config', label: '系统配置', module: '系统' },
  ];

  return (
    <div className="h-full flex gap-6">
      <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">角色列表</h3>
          <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400">加载中...</div>
          ) : (
            roles.map(role => (
              <div 
                key={role.id} 
                onClick={() => setSelectedRole(role)}
                className={`group flex items-center gap-3 py-3 px-4 rounded-xl transition-all cursor-pointer border ${
                  selectedRole?.id === role.id 
                    ? 'bg-primary/5 border-primary/20 text-primary' 
                    : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Shield className={`w-4 h-4 ${selectedRole?.id === role.id ? 'text-primary' : 'text-slate-400'}`} />
                <div className="flex-1">
                  <div className="font-bold text-sm">{role.name}</div>
                  <div className="text-[10px] font-mono opacity-60 uppercase tracking-tighter">{role.code}</div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">角色权限配置</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">取消</button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors">保存权限</button>
          </div>
        </div>
        <div className="p-8 space-y-8 overflow-y-auto">
          {selectedRole ? (
            <>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">角色名称</label>
                  <input type="text" value={selectedRole.name} readOnly className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">角色代码</label>
                  <input type="text" value={selectedRole.code} readOnly className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-mono" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">权限分配</label>
                <div className="grid grid-cols-2 gap-4">
                  {permissions.map(perm => {
                    const hasPerm = selectedRole.permissions.includes('all') || selectedRole.permissions.includes(perm.id);
                    return (
                      <div key={perm.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        hasPerm ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${hasPerm ? 'bg-white text-emerald-500 shadow-sm' : 'bg-slate-100 text-slate-300'}`}>
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold">{perm.label}</div>
                            <div className="text-[10px] opacity-60 uppercase tracking-widest">{perm.module}模块</div>
                          </div>
                        </div>
                        <button className={`w-10 h-6 rounded-full relative transition-colors ${hasPerm ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hasPerm ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">请选择一个角色进行配置</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
