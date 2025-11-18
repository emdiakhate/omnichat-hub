import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Inbox, 
  Tag, 
  UsersRound, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/conversations", icon: MessageSquare, label: "Conversations", badge: 3 },
  { to: "/contacts", icon: Users, label: "Contacts" },
  { to: "/inboxes", icon: Inbox, label: "Boîtes de réception" },
  { to: "/tags", icon: Tag, label: "Tags" },
  { to: "/teams", icon: UsersRound, label: "Équipes" },
  { to: "/settings", icon: Settings, label: "Paramètres" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 border-r border-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">MessageHub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary"
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Jean Dupont</p>
            <p className="text-xs text-muted-foreground truncate">jean@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
