import { useLocation, useNavigate } from "react-router-dom";
import logoYetzSidebar from "../../assets/campanhas/logo-yetz-sidebar.svg";
import avatar from "../../assets/campanhas/avatar.svg";
import { FileIcon, LineChartIcon } from "./icons";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    {
      label: "Campanhas",
      path: "/campanhas",
      icon: <LineChartIcon size={24} />,
    },
    {
      label: "Contratos",
      path: "/contratos",
      icon: <FileIcon size={24} />,
    },
  ];

  return (
    <aside className="flex h-full shrink-0 flex-col items-center border-r border-[#cacaca] bg-white p-4">
      <div className="flex flex-1 flex-col items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <div className="flex w-full flex-col items-center py-4">
            <img src={logoYetzSidebar} alt="Yetz" className="h-[27px] w-auto" />
          </div>
          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              const active = pathname.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  title={item.label}
                  aria-label={item.label}
                  onClick={() => navigate(item.path)}
                  className={`flex h-12 w-12 items-center justify-center rounded-md p-3 transition-colors ${
                    active
                      ? "bg-[#00842f] text-white hover:bg-[#006b26]"
                      : "text-black hover:bg-[#e6f3ea] hover:text-[#00842f]"
                  }`}
                >
                  {item.icon}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex w-full items-center justify-center py-4">
          <button type="button" title="Perfil" aria-label="Perfil" className="transition-opacity hover:opacity-80">
            <img src={avatar} alt="" className="h-8 w-8 rounded-full" />
          </button>
        </div>
      </div>
    </aside>
  );
}
