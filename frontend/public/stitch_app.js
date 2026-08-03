/**
 * Sand Guard - Master Interactivity & Interconnected Navigation Script
 * Provides unified sidebar navigation, topbar controls, live search, global modals,
 * and complete page-specific interactive logic across all 11 Stitch HTML screens.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('[Sand Guard] Initializing master application interactivity...');

    const currentPath = window.location.pathname;

    // --- 1. Toast Notification System ---
    let toastContainer = document.getElementById('sandguard-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'sandguard-toast-container';
        toastContainer.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(toastContainer);
    }

    window.showToast = function(message, type = 'info') {
        const toast = document.createElement('div');
        let icon = 'info';
        let borderColor = 'border-[#d9a441]';
        let textColor = 'text-[#d9a441]';
        if (type === 'success') { icon = 'check_circle'; borderColor = 'border-emerald-400'; textColor = 'text-emerald-400'; }
        if (type === 'warning') { icon = 'warning'; borderColor = 'border-amber-400'; textColor = 'text-amber-400'; }
        if (type === 'error') { icon = 'error'; borderColor = 'border-red-400'; textColor = 'text-red-400'; }

        toast.className = `pointer-events-auto bg-[#332b1f]/95 border ${borderColor} text-white px-4 py-3 rounded-lg shadow-2xl font-mono text-xs flex items-center gap-3 transform translate-y-4 opacity-0 transition-all duration-300 backdrop-blur-md`;
        toast.innerHTML = `
            <span class="material-symbols-outlined ${textColor} text-lg">${icon}</span>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // --- 2. Global Modal Container ---
    let modalOverlay = document.getElementById('sandguard-modal-overlay');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'sandguard-modal-overlay';
        modalOverlay.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-[9990] flex items-center justify-center p-4 hidden opacity-0 transition-opacity duration-300';
        modalOverlay.innerHTML = `
            <div id="sandguard-modal-content" class="bg-[#332b1f] border border-[#d9a441]/40 rounded-xl p-6 max-w-lg w-full text-white shadow-2xl relative font-mono text-xs space-y-4 transform scale-95 transition-transform duration-300">
                <button id="sandguard-modal-close" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div id="sandguard-modal-body"></div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        document.getElementById('sandguard-modal-close').addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    function openModal(htmlContent) {
        const body = document.getElementById('sandguard-modal-body');
        const content = document.getElementById('sandguard-modal-content');
        body.innerHTML = htmlContent;
        modalOverlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            modalOverlay.classList.remove('opacity-0');
            content.classList.remove('scale-95');
        });
    }

    function closeModal() {
        const content = document.getElementById('sandguard-modal-content');
        modalOverlay.classList.add('opacity-0');
        content.classList.add('scale-95');
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
        }, 300);
    }
    window.closeModal = closeModal;
    window.openModal = openModal;

    // --- 3. Unified Sidebar Injection & Highlight ---
    const sidebarRoutes = [
        { name: 'Command Center', icon: 'dashboard', path: '/stitch_html/02_command_center_dashboard.html' },
        { name: 'GIS Monitoring', icon: 'map', path: '/stitch_html/03_gis_monitoring.html' },
        { name: 'Satellite Intelligence', icon: 'satellite_alt', path: '/stitch_html/04_satellite_intelligence.html' },
        { name: 'Drone Monitoring', icon: 'precision_manufacturing', path: '/stitch_html/05_drone_verification.html' },
        { name: 'Vehicle Analytics', icon: 'local_shipping', path: '/stitch_html/06_vehicle_analytics.html' },
        { name: 'AI Prediction', icon: 'psychology', path: '/stitch_html/07_ai_prediction.html' },
        { name: 'AI Explainability', icon: 'query_stats', path: '/stitch_html/08_ai_explainability.html' },
        { name: 'Alert Management', icon: 'warning', path: '/stitch_html/09_alert_management.html' },
        { name: 'Report Generation', icon: 'description', path: '/stitch_html/10_report_generation.html' },
        { name: 'Mobile Officer App', icon: 'smartphone', path: '/stitch_html/11_mobile_field_officer.html' }
    ];

    const aside = document.querySelector('aside');
    if (aside && !currentPath.includes('01_login.html')) {
        const nav = aside.querySelector('nav');
        if (nav) {
            nav.innerHTML = sidebarRoutes.map(item => {
                const isActive = currentPath.includes(item.path.split('/').pop());
                const activeClasses = isActive 
                    ? 'text-[#c3f5ff] border-l-2 border-[#d9a441] bg-[#d9a441]/10 font-bold' 
                    : 'text-[#bac9cc] hover:bg-[#d9a441]/5 hover:text-[#c3f5ff]';
                return `
                    <a class="flex items-center gap-3 px-3 py-2 ${activeClasses} transition-all rounded-md" href="${item.path}">
                        <span class="material-symbols-outlined text-lg" ${isActive ? "style=\"font-variation-settings: 'FILL' 1;\"" : ""}>${item.icon}</span>
                        <span class="font-label-caps text-xs">${item.name}</span>
                    </a>
                `;
            }).join('');
        }

        // Fix bottom logout link in sidebar
        let logoutBtn = aside.querySelector('a[href*="01_login.html"]');
        if (!logoutBtn) {
            const footerDiv = aside.querySelector('.mt-auto');
            if (footerDiv) {
                footerDiv.innerHTML = `
                    <a class="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 transition-all rounded-md" href="/stitch_html/01_login.html">
                        <span class="material-symbols-outlined text-lg">logout</span>
                        <span class="font-label-caps text-xs">Logout</span>
                    </a>
                `;
            }
        }
    }

    // --- 4. Topbar Live Search & Actions ---
    const searchInputs = document.querySelectorAll('header input[type="text"], nav input[type="text"], input[placeholder*="Search"]');
    searchInputs.forEach(input => {
        const parent = input.parentElement;
        if (!parent) return;
        parent.style.position = 'relative';

        let dropdown = document.createElement('div');
        dropdown.className = 'absolute top-full left-0 w-full mt-2 bg-[#332b1f] border border-[#d9a441]/40 rounded-lg shadow-2xl text-white font-mono text-xs hidden z-[999] overflow-hidden';
        parent.appendChild(dropdown);

        const mockResults = [
            { text: 'Incident #ALT-9942 - Bhavani River Sector 4B', path: '/stitch_html/09_alert_management.html' },
            { text: 'GIS Hotspot - Bhavani Basin Lat 11.3412° N', path: '/stitch_html/03_gis_monitoring.html' },
            { text: 'Drone Recon Alpha-1 - Sector 4B Flight', path: '/stitch_html/05_drone_verification.html' },
            { text: 'ANPR Checkpoint 09 - Vehicle TN52 AB4321', path: '/stitch_html/06_vehicle_analytics.html' },
            { text: 'ISRO-SAT 2A Sentinel Surface Scan Delta', path: '/stitch_html/04_satellite_intelligence.html' },
            { text: 'AI Risk Prediction Model - High Risk Forecast', path: '/stitch_html/07_ai_prediction.html' },
            { text: 'SHAP Feature Attribution Compliance Log', path: '/stitch_html/08_ai_explainability.html' },
            { text: 'Court Dossier Generator #DOS-2026-9942', path: '/stitch_html/10_report_generation.html' }
        ];

        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                dropdown.classList.add('hidden');
                return;
            }
            const matches = mockResults.filter(r => r.text.toLowerCase().includes(query));
            if (matches.length === 0) {
                dropdown.innerHTML = `<div class="p-3 text-gray-400">No matching telemetry found</div>`;
            } else {
                dropdown.innerHTML = matches.map(m => `
                    <div class="p-3 hover:bg-[#d9a441]/15 cursor-pointer border-b border-gray-800/50 flex items-center justify-between" onclick="window.location.href='${m.path}'">
                        <span>${m.text}</span>
                        <span class="material-symbols-outlined text-sm text-[#d9a441]">arrow_forward</span>
                    </div>
                `).join('');
            }
            dropdown.classList.remove('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!parent.contains(e.target)) dropdown.classList.add('hidden');
        });
    });

    // --- 5. Topbar Action Icon Buttons ---
    // Notifications Button
    document.querySelectorAll('button').forEach(btn => {
        const hasNotifIcon = btn.querySelector('.material-symbols-outlined')?.innerText === 'notifications' || btn.getAttribute('aria-label') === 'Notifications';
        if (hasNotifIcon) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(`
                    <div class="space-y-3">
                        <div class="flex justify-between items-center border-b border-[#d9a441]/30 pb-2">
                            <h3 class="font-bold text-[#d9a441] flex items-center gap-2">
                                <span class="material-symbols-outlined">notifications</span>
                                REAL-TIME SYSTEM NOTIFICATIONS (7)
                            </h3>
                        </div>
                        <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
                            <div class="bg-red-500/10 border border-red-500/30 p-2.5 rounded flex justify-between items-start">
                                <div>
                                    <div class="font-bold text-red-400">CRITICAL ALARM #ALT-9942</div>
                                    <div class="text-gray-300 text-[11px]">Unlicensed excavator detected in Bhavani River</div>
                                </div>
                                <span class="text-[10px] text-gray-400">2m ago</span>
                            </div>
                            <div class="bg-[#d9a441]/10 border border-[#d9a441]/30 p-2.5 rounded flex justify-between items-start">
                                <div>
                                    <div class="font-bold text-[#d9a441]">ANPR FLAG #VEH-4321</div>
                                    <div class="text-gray-300 text-[11px]">Blacklisted truck passed Checkpost 09</div>
                                </div>
                                <span class="text-[10px] text-gray-400">14m ago</span>
                            </div>
                            <div class="bg-gray-800 p-2.5 rounded flex justify-between items-start">
                                <div>
                                    <div class="font-bold text-gray-300">ISRO-SAT PASS COMPLETE</div>
                                    <div class="text-gray-300 text-[11px]">Sentinel-2 optical pass synced successfully</div>
                                </div>
                                <span class="text-[10px] text-gray-400">45m ago</span>
                            </div>
                        </div>
                        <button onclick="window.showToast('All notifications marked as read', 'success'); window.closeModal();" class="w-full bg-[#d9a441] text-black font-bold py-2 rounded hover:bg-[#8aa48f] transition-colors">
                            MARK ALL AS READ
                        </button>
                    </div>
                `);
            });
        }

        // Satellite Status Icon
        const hasSatIcon = btn.querySelector('.material-symbols-outlined')?.innerText === 'satellite' || btn.getAttribute('aria-label') === 'Satellite Status';
        if (hasSatIcon) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(`
                    <div class="space-y-3">
                        <h3 class="font-bold text-[#d9a441] border-b border-[#d9a441]/30 pb-2 flex items-center gap-2">
                            <span class="material-symbols-outlined">satellite_alt</span>
                            ISRO-SAT TELEMETRY STATUS
                        </h3>
                        <div class="bg-[#0c162d] p-3 rounded space-y-1.5 text-[11px]">
                            <div><strong>ACTIVE SATELLITES:</strong> ISRO Sentinel-2A, Landsat-9</div>
                            <div><strong>ORBITAL FREQUENCY:</strong> Revisit every 6 hours</div>
                            <div><strong>RESOLUTION:</strong> 10m Multispectral / 0.5m Pan</div>
                            <div><strong>STATUS:</strong> <span class="text-emerald-400 font-bold">ONLINE & SYNCED</span></div>
                        </div>
                        <button onclick="window.location.href='/stitch_html/04_satellite_intelligence.html'" class="w-full bg-[#d9a441] text-black font-bold py-2 rounded">
                            OPEN SATELLITE INTELLIGENCE
                        </button>
                    </div>
                `);
            });
        }

        // Sensors Icon
        const hasSensorIcon = btn.querySelector('.material-symbols-outlined')?.innerText === 'sensors' || btn.getAttribute('aria-label') === 'Sensors';
        if (hasSensorIcon) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(`
                    <div class="space-y-3">
                        <h3 class="font-bold text-[#d9a441] border-b border-[#d9a441]/30 pb-2 flex items-center gap-2">
                            <span class="material-symbols-outlined">sensors</span>
                            RIVER BASIN SENSOR NETWORK
                        </h3>
                        <div class="space-y-2 text-[11px]">
                            <div class="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded flex justify-between">
                                <span>Acoustic Dredging Sensors (18 Nodes)</span>
                                <span class="text-emerald-400 font-bold">ALL ACTIVE</span>
                            </div>
                            <div class="bg-amber-500/10 border border-amber-500/30 p-2 rounded flex justify-between">
                                <span>River Depth Gauges (12 Nodes)</span>
                                <span class="text-amber-400 font-bold">CALIBRATING</span>
                            </div>
                        </div>
                    </div>
                `);
            });
        }

        // Videocam / Live Feeds Icon
        const hasCamIcon = btn.querySelector('.material-symbols-outlined')?.innerText === 'videocam' || btn.getAttribute('aria-label') === 'Live Video Feeds';
        if (hasCamIcon) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(`
                    <div class="space-y-3">
                        <h3 class="font-bold text-[#d9a441] border-b border-[#d9a441]/30 pb-2 flex items-center gap-2">
                            <span class="material-symbols-outlined">videocam</span>
                            LIVE CAMERA FEED GRID
                        </h3>
                        <div class="grid grid-cols-2 gap-2 text-[10px]">
                            <div class="bg-black border border-gray-700 p-2 text-center rounded">
                                <div class="text-[#d9a441] font-bold">DRONE ALPHA-1 FLIR</div>
                                <div class="text-emerald-400 animate-pulse mt-1">● LIVE STREAMING</div>
                            </div>
                            <div class="bg-black border border-gray-700 p-2 text-center rounded">
                                <div class="text-[#d9a441] font-bold">ANPR CHECKPOST 09</div>
                                <div class="text-emerald-400 animate-pulse mt-1">● LIVE STREAMING</div>
                            </div>
                        </div>
                        <button onclick="window.location.href='/stitch_html/05_drone_verification.html'" class="w-full bg-[#d9a441] text-black font-bold py-2 rounded">
                            OPEN DRONE RECON FEED
                        </button>
                    </div>
                `);
            });
        }

        // Settings Icon
        const hasSettingIcon = btn.querySelector('.material-symbols-outlined')?.innerText === 'settings';
        if (hasSettingIcon) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(`
                    <div class="space-y-3">
                        <h3 class="font-bold text-[#d9a441] border-b border-[#d9a441]/30 pb-2 flex items-center gap-2">
                            <span class="material-symbols-outlined">settings</span>
                            SYSTEM PARAMETERS CONFIGURATION
                        </h3>
                        <div class="space-y-3 text-xs">
                            <div>
                                <label class="block text-gray-300 font-bold mb-1">AI ALERT THRESHOLD</label>
                                <input type="range" min="50" max="95" value="80" class="w-full accent-[#d9a441]" />
                            </div>
                            <div>
                                <label class="block text-gray-300 font-bold mb-1">SATELLITE AUTO-REFRESH</label>
                                <select class="w-full bg-[#0c162d] border border-gray-700 text-white p-2 rounded">
                                    <option>Every 15 Minutes</option>
                                    <option>Every 1 Hour</option>
                                    <option>Real-Time Push Only</option>
                                </select>
                            </div>
                        </div>
                        <button onclick="window.showToast('Settings saved successfully', 'success'); window.closeModal();" class="w-full bg-[#d9a441] text-black font-bold py-2 rounded">
                            SAVE PREFERENCES
                        </button>
                    </div>
                `);
            });
        }
    });

    // Profile Avatar click
    document.querySelectorAll('img[src*="aida-public"]').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            openModal(`
                <div class="space-y-3 text-center">
                    <div class="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-[#d9a441]">
                        <img src="${img.src}" class="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-white">Inspector General R. Sharma</h3>
                        <p class="text-xs text-[#d9a441]">State Sand Mining Enforcement Cell</p>
                        <p class="text-[10px] text-gray-400 mt-0.5">Badge ID: ENV-OFF-042 | Level 5 Clearance</p>
                    </div>
                    <button onclick="window.location.href='/stitch_html/01_login.html'" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded transition-colors">
                        LOGOUT OFFICER SESSION
                    </button>
                </div>
            `);
        });
    });

    // --- 6. PAGE-SPECIFIC INTERACTION LOGIC ---

    // [01_login.html]
    if (currentPath.includes('01_login.html')) {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm">sync</span> AUTHENTICATING...`;
                window.showToast('Authentication Successful! Accessing Command Center...', 'success');
                setTimeout(() => {
                    window.location.href = '/stitch_html/02_command_center_dashboard.html';
                }, 1000);
            });
        }

        const forgotLink = document.querySelector('a[href*="Forgot"]');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(`
                    <div class="space-y-3">
                        <h3 class="font-bold text-[#d9a441] border-b border-[#d9a441]/30 pb-2">RESET SECURITY ACCESS TOKEN</h3>
                        <p class="text-gray-300">Enter your Official Badge ID to receive an OTP on your registered government mobile.</p>
                        <input type="text" placeholder="e.g. env-off-042" class="w-full bg-[#0c162d] border border-gray-700 p-2.5 rounded text-white font-mono" />
                        <button onclick="window.showToast('OTP sent to registered mobile number', 'info'); window.closeModal();" class="w-full bg-[#d9a441] text-black font-bold py-2.5 rounded">
                            SEND OTP TOKEN
                        </button>
                    </div>
                `);
            });
        }
    }

    // [02_command_center_dashboard.html]
    if (currentPath.includes('02_command_center_dashboard.html')) {
        // Emergency Override Button
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('EMERGENCY OVERRIDE')) {
                btn.addEventListener('click', () => {
                    openModal(`
                        <div class="space-y-4">
                            <div class="flex items-center gap-2 text-red-400 font-bold border-b border-red-500/30 pb-2 text-sm">
                                <span class="material-symbols-outlined">warning</span>
                                EMERGENCY LOCKDOWN OVERRIDE PROTOCOL
                            </div>
                            <p class="text-gray-300">This action will trigger an immediate multi-agency lockdown alert across all 12 high-risk river basins and alert local police checkpoints.</p>
                            <button onclick="window.showToast('EMERGENCY LOCKDOWN PROTOCOL ACTIVATED!', 'error'); window.closeModal();" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded">
                                EXECUTE EMERGENCY LOCKDOWN
                            </button>
                        </div>
                    `);
                });
            }
            if (btn.innerText.includes('INSPECT GIS HOTSPOT')) {
                btn.addEventListener('click', () => {
                    window.location.href = '/stitch_html/03_gis_monitoring.html';
                });
            }
            if (btn.innerText.includes('DISPATCH DRONE')) {
                btn.addEventListener('click', () => {
                    openModal(`
                        <div class="space-y-3">
                            <h3 class="font-bold text-[#d9a441] border-b border-[#d9a441]/30 pb-2">DISPATCH RECON DRONE ALPHA-1</h3>
                            <p class="text-gray-300">Target Coordinates: Lat 11.3412° N, Lng 77.7172° E (Bhavani River Sector 4B)</p>
                            <button onclick="window.showToast('Drone Alpha-1 dispatched to Sector 4B!', 'success'); window.closeModal(); setTimeout(() => window.location.href='/stitch_html/05_drone_verification.html', 1000);" class="w-full bg-[#d9a441] text-black font-bold py-2.5 rounded">
                                CONFIRM DRONE LAUNCH
                            </button>
                        </div>
                    `);
                });
            }
        });

        // Zoom buttons
        const mapContainer = document.querySelector('img[alt*="Map"]')?.parentElement;
        if (mapContainer) {
            let scale = 1;
            const zoomInBtn = mapContainer.querySelector('button span:contains("add")')?.parentElement || mapContainer.querySelectorAll('button')[0];
            const zoomOutBtn = mapContainer.querySelectorAll('button')[1];
            const img = mapContainer.querySelector('img');

            if (zoomInBtn && img) {
                zoomInBtn.addEventListener('click', () => {
                    scale = Math.min(scale + 0.25, 2.5);
                    img.style.transform = `scale(${scale})`;
                    img.style.transition = 'transform 0.3s ease';
                    window.showToast(`Map Zoom: ${(scale * 100).toFixed(0)}%`);
                });
            }
            if (zoomOutBtn && img) {
                zoomOutBtn.addEventListener('click', () => {
                    scale = Math.max(scale - 0.25, 0.8);
                    img.style.transform = `scale(${scale})`;
                    img.style.transition = 'transform 0.3s ease';
                    window.showToast(`Map Zoom: ${(scale * 100).toFixed(0)}%`);
                });
            }
        }
    }

    // [03_gis_monitoring.html]
    if (currentPath.includes('03_gis_monitoring.html')) {
        document.querySelectorAll('input[type="checkbox"]').forEach(box => {
            box.addEventListener('change', (e) => {
                const label = e.target.parentElement?.innerText?.trim() || 'Layer';
                window.showToast(`GIS Layer Toggle: ${label} is now ${e.target.checked ? 'VISIBLE' : 'HIDDEN'}`, 'info');
            });
        });

        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('Polygon') || btn.innerText.includes('Measure') || btn.innerText.includes('Point')) {
                btn.addEventListener('click', () => {
                    window.showToast(`GIS Measurement Tool Activated: ${btn.innerText.trim()}`, 'success');
                });
            }
        });
    }

    // [04_satellite_intelligence.html]
    if (currentPath.includes('04_satellite_intelligence.html')) {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('Sentinel') || btn.innerText.includes('Landsat') || btn.innerText.includes('PlanetScope')) {
                btn.addEventListener('click', () => {
                    window.showToast(`Switched active satellite feed to: ${btn.innerText.trim()}`, 'success');
                });
            }
            if (btn.innerText.includes('Export') || btn.innerText.includes('Download') || btn.innerText.includes('Report')) {
                btn.addEventListener('click', () => {
                    window.showToast('Compiling Satellite Surface Analysis PDF...', 'info');
                    setTimeout(() => window.showToast('Satellite Report Downloaded!', 'success'), 1200);
                });
            }
            if (btn.innerText.includes('Tasking') || btn.innerText.includes('Initialize Scan')) {
                btn.addEventListener('click', () => {
                    openModal(`
                        <div class="space-y-3">
                            <h3 class="font-bold text-[#d9a441] border-b border-[#d9a441]/30 pb-2">REQUEST SATELLITE HIGH-RES TASKING</h3>
                            <p class="text-gray-300">Requesting immediate ISRO Sentinel-2A panchromatic re-imaging over target river basin.</p>
                            <button onclick="window.showToast('Satellite Tasking Scheduled for next pass (04:15 UTC)', 'success'); window.closeModal();" class="w-full bg-[#d9a441] text-black font-bold py-2.5 rounded">
                                CONFIRM TASKING REQUEST
                            </button>
                        </div>
                    `);
                });
            }
        });
    }

    // [05_drone_verification.html]
    if (currentPath.includes('05_drone_verification.html')) {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('DISPATCH') || btn.innerText.includes('AUTONOMOUS')) {
                btn.addEventListener('click', () => {
                    window.showToast('Drone Alpha-1 Autonomous Flight Protocol Initiated!', 'success');
                });
            }
            if (btn.innerText.includes('Thermal') || btn.innerText.includes('Optical') || btn.innerText.includes('Night')) {
                btn.addEventListener('click', () => {
                    window.showToast(`Camera Spectrum Mode Switched to: ${btn.innerText.trim()}`, 'info');
                });
            }
            if (btn.innerText.includes('RETURN') || btn.innerText.includes('BASE')) {
                btn.addEventListener('click', () => {
                    window.showToast('Drone Alpha-1 returning to home base.', 'warning');
                });
            }
        });
    }

    // [06_vehicle_analytics.html]
    if (currentPath.includes('06_vehicle_analytics.html')) {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('FLAG') || btn.innerText.includes('INTERCEPT')) {
                btn.addEventListener('click', () => {
                    openModal(`
                        <div class="space-y-3">
                            <h3 class="font-bold text-red-400 border-b border-red-500/30 pb-2">FLAG VEHICLE & ISSUE POLICE INTERCEPT</h3>
                            <p class="text-gray-300">Target Vehicle: TN52 AB4321 (CAT Heavy Dump Truck - 15 Unlicensed Trips)</p>
                            <button onclick="window.showToast('Vehicle Intercept Alert Sent to Mobile Officers!', 'error'); window.closeModal();" class="w-full bg-red-600 text-white font-bold py-2.5 rounded">
                                TRANSMIT INTERCEPT ORDER
                            </button>
                        </div>
                    `);
                });
            }
            if (btn.innerText.includes('EXPORT') || btn.innerText.includes('LOG')) {
                btn.addEventListener('click', () => {
                    window.showToast('ANPR Vehicle Transit Log exported (ANPR-2026-08-01.csv)', 'success');
                });
            }
        });
    }

    // [07_ai_prediction.html]
    if (currentPath.includes('07_ai_prediction.html')) {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('RUN') || btn.innerText.includes('SIMULATION') || btn.innerText.includes('PREDICT')) {
                btn.addEventListener('click', () => {
                    window.showToast('Running Random Forest + CNN Spatial Simulation...', 'info');
                    setTimeout(() => window.showToast('Prediction Complete! High Risk Sector: Bhavani Reach 4B (94%)', 'warning'), 1200);
                });
            }
        });
    }

    // [08_ai_explainability.html]
    if (currentPath.includes('08_ai_explainability.html')) {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('AUDIT') || btn.innerText.includes('LOG') || btn.innerText.includes('COMPLIANCE')) {
                btn.addEventListener('click', () => {
                    window.showToast('Compiled XAI Governance Audit Log (XAI-SHAP-2026.pdf)', 'success');
                });
            }
        });
    }

    // [09_alert_management.html]
    if (currentPath.includes('09_alert_management.html')) {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('DISPATCH FIELD OFFICER') || btn.innerText.includes('DISPATCH')) {
                btn.addEventListener('click', () => {
                    openModal(`
                        <div class="space-y-3">
                            <h3 class="font-bold text-[#d9a441] border-b border-[#d9a441]/30 pb-2">DISPATCH FIELD ENFORCEMENT OFFICER</h3>
                            <p class="text-gray-300">Assigning Officer to Incident #ALT-9942 (Bhavani River Sector 4B)</p>
                            <button onclick="window.showToast('Field Officer Dispatched to Sector 4B via Mobile App', 'success'); window.closeModal();" class="w-full bg-[#d9a441] text-black font-bold py-2.5 rounded">
                                DISPATCH NEAREST PATROL
                            </button>
                        </div>
                    `);
                });
            }
            if (btn.innerText.includes('FALSE ALARM')) {
                btn.addEventListener('click', () => {
                    window.showToast('Alert marked as False Alarm & archived.', 'info');
                });
            }
            if (btn.innerText.includes('RESOLVE') || btn.innerText.includes('MARK RESOLVED')) {
                btn.addEventListener('click', () => {
                    window.showToast('Alert status set to RESOLVED.', 'success');
                });
            }
        });
    }

    // [11_mobile_field_officer.html]
    if (currentPath.includes('11_mobile_field_officer.html')) {
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('SOS') || btn.innerText.includes('PANIC') || btn.innerText.includes('EMERGENCY')) {
                btn.addEventListener('click', () => {
                    openModal(`
                        <div class="space-y-3">
                            <h3 class="font-bold text-red-500 border-b border-red-500/30 pb-2 flex items-center gap-2">
                                <span class="material-symbols-outlined">warning</span>
                                FIELD OFFICER SOS PANIC ALERT
                            </h3>
                            <p class="text-gray-300">Transmitting officer GPS coordinates to State Command & local police for immediate armed assistance!</p>
                            <button onclick="window.showToast('POLICE & COMMAND SOS ALERT TRANSMITTED!', 'error'); window.closeModal();" class="w-full bg-red-600 text-white font-bold py-3 rounded">
                                TRANSMIT HIGH-PRIORITY SOS
                            </button>
                        </div>
                    `);
                });
            }
            if (btn.innerText.includes('PHOTO') || btn.innerText.includes('CAMERA') || btn.innerText.includes('EVIDENCE')) {
                btn.addEventListener('click', () => {
                    window.showToast('Captured Geo-Tagged Photo Evidence (IMG_2026_GPS_SECTOR4B.JPG)', 'success');
                });
            }
            if (btn.innerText.includes('AUDIO') || btn.innerText.includes('VOICE')) {
                btn.addEventListener('click', () => {
                    window.showToast('Voice Memo Recording Started (Audio Waveform Active)', 'info');
                });
            }
            if (btn.innerText.includes('SUBMIT') || btn.innerText.includes('REPORT')) {
                btn.addEventListener('click', () => {
                    window.showToast('Field Inspection Report Submitted to Command Center!', 'success');
                });
            }
        });
    }
});
