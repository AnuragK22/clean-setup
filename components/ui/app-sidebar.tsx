import { 
    Home, 
    Plus, 
    Calendar, 
    Bot, 
    Users, 
    Bus, 
    HandCoins, 
    Headphones, 
    Megaphone, 
    Building2, 
    GraduationCap, 
    CheckSquare, 
    BookOpen, 
    Clipboard, 
    FileText, 
    Tag, 
    Settings, 
    AlertTriangle,
    User,
    ChevronDown,
    LogOut,
    Bell,
    CreditCard,
    Zap
  } from "lucide-react"
  
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarSeparator
  } from "@/components/ui/sidebar"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Button } from "@/components/ui/button"
  
  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Create",
      url: "/create",
      icon: Plus,
    },
    {
      title: "Your schedule",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Ask AI",
      url: "/ai",
      icon: Bot,
    },
    {
      title: "Attendance",
      url: "/attendance",
      icon: Users,
    },
    {
      title: "Transit pass",
      url: "/transitpass",
      icon: Bus,
    },
    {
      title: "Services",
      url: "/service",
      icon: HandCoins,
    },
    {
      title: "Support",
      url: "/support",
      icon: Headphones,
    },
    {
      title: "Announcements",
      url: "/feed?tab=announcements",
      icon: Megaphone,
    },
    {
      title: "Campus",
      url: "/campus",
      icon: Building2,
    },
    {
      title: "Classes",
      url: "/classes",
      icon: GraduationCap,
    },
    {
      title: "Events",
      url: "/feed?tab=events",
      icon: Calendar,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CheckSquare,
    },
    {
      title: "Directory",
      url: "/directory",
      icon: Users,
    },
    {
      title: "Resources",
      url: "/resources",
      icon: BookOpen,
    },
    {
      title: "Compliance",
      url: "/compliance",
      icon: Clipboard,
    },
    {
      title: "Master agreement",
      url: "/reports/master-agreements",
      icon: FileText,
    },
    {
      title: "Learning report",
      url: "/reports/learning-reports",
      icon: FileText,
    },
    {
      title: "NFC",
      url: "/nfc",
      icon: Tag,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Emergency",
      url: "/emergency",
      icon: AlertTriangle,
    },
  ]
  
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/placeholder-user.jpg'
  }

  export function AppSidebar() {
    return (
      <Sidebar collapsible="icon">
        <SidebarContent className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon size={24} />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
          
          <SidebarFooter className="pt-2">
            <SidebarSeparator className="mb-2" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full h-auto p-2 flex items-center gap-2 justify-between hover:bg-accent/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left overflow-hidden">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" side="top">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Zap className="mr-2 h-4 w-4 text-amber-500" />
                    <span>Upgrade to Pro</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
    )
  }