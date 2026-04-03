import React, { useState, useEffect } from 'react';
import { Building2, ChevronRight, ChevronDown, Plus, Edit, Trash2, Search, Briefcase, Users } from 'lucide-react';
import { queryOrgTree } from '../../api/services/platform';
import { OrgNode } from '../../types/platform';

const OrgManagement: React.FC = () => {
  const [tree, setTree] = useState<OrgNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['ORG001']));

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryOrgTree();
      setTree(res.data);
    } catch (error) {
      console.error('Failed to fetch org tree:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const renderNode = (node: OrgNode, level: number = 0) => {
    const isExpanded = expanded.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="flex flex-col">
        <div 
          className={`group flex items-center gap-3 py-3 px-4 rounded-xl transition-all cursor-pointer ${
            level === 0 ? 'bg-slate-50 border border-slate-100' : 'hover:bg-slate-50'
          }`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggleExpand(node.id);
            }}
            className={`p-1 rounded hover:bg-slate-200 transition-colors ${!hasChildren && 'invisible'}`}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </div>
          <div className={`p-2 rounded-lg ${
            node.type === 'company' ? 'bg-primary/10 text-primary' : 
            node.type === 'department' ? 'bg-blue-100 text-blue-600' : 
            'bg-emerald-100 text-emerald-600'
          }`}>
            {node.type === 'company' ? <Building2 className="w-4 h-4" /> : 
             node.type === 'department' ? <Briefcase className="w-4 h-4" /> : 
             <Users className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <span className={`font-bold ${level === 0 ? 'text-slate-800' : 'text-slate-700'}`}>{node.name}</span>
            <span className="ml-3 text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{node.id}</span>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex gap-6">
      <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">组织架构树</h3>
          <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400">加载中...</div>
          ) : (
            tree.map(node => renderNode(node))
          )}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">机构详情</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">编辑</button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-container transition-colors">保存修改</button>
          </div>
        </div>
        <div className="p-8 space-y-8 max-w-2xl">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">机构名称</label>
              <input type="text" defaultValue="智慧环卫集团" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-800" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">机构代码</label>
              <input type="text" defaultValue="ORG001" readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">机构类型</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-800">
                <option value="company">公司</option>
                <option value="department">部门</option>
                <option value="team">班组</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">上级机构</label>
              <input type="text" defaultValue="无" readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">备注说明</label>
            <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700" placeholder="请输入机构备注信息..."></textarea>
          </div>
          <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-black text-primary">12</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">下级机构</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800">156</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">人员总数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800">42</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">车辆总数</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgManagement;
