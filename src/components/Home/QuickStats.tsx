interface QuickStatsProps {
  quickActions: any[];
}
export function QuickStats({ quickActions }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`relative glass-card border-white/20 p-6 rounded-xl hover:scale-105 transition-all bg-gradient-to-br ${action.gradient} group`}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-8 h-8 text-white" />
              {action.count > 0 && action.id === "today" && (
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">{action.title}</p>
              <p className="text-3xl font-bold text-white">{action.count}</p>
            </div>
            {action.count > 0 && (
              <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        );
      })}
    </div>
  );
}