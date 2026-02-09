export async function initProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  // Наладжваем сетку: 1 калонка на мабілках, 2 калонкі на планшэтах/ПК
  container.className = "grid grid-cols-1 md:grid-cols-2 gap-6";

  try {
    const response = await fetch("/data/projects.json");
    const projects = await response.json();

    container.innerHTML = projects
      .map(
        (p) => `
            <div class="border border-white/10 bg-[#111] p-8 flex flex-col justify-between hover:border-red-600/50 transition-all group relative">
                <div class="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-600/10 px-2 py-1">
                    ${p.status}
                </div>
                
                <div>
                    <div class="text-4xl mb-6">${p.icon}</div>
                    <span class="text-red-600/60 text-[10px] uppercase font-bold tracking-widest mb-2 block">${p.category}</span>
                    <h3 class="text-2xl font-black uppercase italic text-white mb-4 group-hover:text-red-600 transition-colors leading-none">
                        ${p.title}
                    </h3>
                    <p class="text-gray-400 text-sm mb-6 leading-relaxed">
                        ${p.description}
                    </p>
                    
                    <ul class="space-y-2 mb-8">
                        ${p.steps
                          .map(
                            (step) => `
                            <li class="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                <span class="w-1 h-1 bg-red-600"></span> ${step}
                            </li>
                        `,
                          )
                          .join("")}
                    </ul>
                </div>

                <a href="https://t.me/your_bot_link" target="_blank" 
                   class="inline-block w-full py-4 bg-white text-black text-center font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all">
                    Падаць заяўку
                </a>
            </div>
        `,
      )
      .join("");
  } catch (e) {
    console.error("Error loading projects:", e);
  }
}
