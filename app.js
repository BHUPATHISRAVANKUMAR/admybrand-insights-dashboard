// Dashboard Data - using provided JSON data
const dashboardData = {
  "dashboardMetrics": {
    "revenue": { "value": 847293, "change": 12.1, "trend": "up" },
    "users": { "value": 124547, "change": 8.5, "trend": "up" },
    "conversions": { "value": 15634, "change": 15.7, "trend": "up" },
    "growthRate": { "value": 18.2, "change": 2.1, "trend": "up" }
  },
  "revenueData": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "data": [678000, 695000, 712000, 728000, 745000, 762000, 780000, 798000, 816000, 832000, 847000, 847293]
  },
  "campaignPerformance": {
    "labels": ["Social Media", "Email", "Search", "Display", "Video"],
    "spend": [45000, 32000, 67000, 38000, 31000],
    "conversions": [2800, 2400, 4200, 1800, 1200]
  },
  "trafficSources": {
    "labels": ["Organic", "Paid", "Social", "Direct"],
    "data": [35, 28, 20, 17]
  },
  "campaignsData": [
    { "id": 1, "name": "Holiday Sale 2024", "channel": "Social Media", "spend": 15420, "clicks": 12450, "cpc": 1.24, "ctr": 3.2, "conversions": 456, "conversionRate": 3.7, "status": "Active" },
    { "id": 2, "name": "Brand Awareness Q4", "channel": "Display", "spend": 28750, "clicks": 18200, "cpc": 1.58, "ctr": 2.8, "conversions": 285, "conversionRate": 1.6, "status": "Active" },
    { "id": 3, "name": "Email Newsletter Dec", "channel": "Email", "spend": 2340, "clicks": 8950, "cpc": 0.26, "ctr": 8.1, "conversions": 892, "conversionRate": 10.0, "status": "Active" },
    { "id": 4, "name": "Search Campaign Winter", "channel": "Search", "spend": 45600, "clicks": 15200, "cpc": 3.00, "ctr": 4.5, "conversions": 1250, "conversionRate": 8.2, "status": "Active" },
    { "id": 5, "name": "Retargeting Campaign", "channel": "Display", "spend": 18900, "clicks": 9850, "cpc": 1.92, "ctr": 2.1, "conversions": 385, "conversionRate": 3.9, "status": "Paused" },
    { "id": 6, "name": "LinkedIn B2B Campaign", "channel": "Social Media", "spend": 22100, "clicks": 5200, "cpc": 4.25, "ctr": 1.8, "conversions": 156, "conversionRate": 3.0, "status": "Active" },
    { "id": 7, "name": "YouTube Video Ads", "channel": "Video", "spend": 31250, "clicks": 28900, "cpc": 1.08, "ctr": 6.2, "conversions": 578, "conversionRate": 2.0, "status": "Active" },
    { "id": 8, "name": "Google Shopping", "channel": "Search", "spend": 38900, "clicks": 22100, "cpc": 1.76, "ctr": 5.1, "conversions": 1580, "conversionRate": 7.1, "status": "Active" },
    { "id": 9, "name": "Facebook Lookalike", "channel": "Social Media", "spend": 19750, "clicks": 14500, "cpc": 1.36, "ctr": 4.8, "conversions": 725, "conversionRate": 5.0, "status": "Active" },
    { "id": 10, "name": "Instagram Stories", "channel": "Social Media", "spend": 12680, "clicks": 18750, "cpc": 0.68, "ctr": 7.2, "conversions": 468, "conversionRate": 2.5, "status": "Draft" },
    { "id": 11, "name": "Podcast Sponsorship", "channel": "Audio", "spend": 8500, "clicks": 3200, "cpc": 2.66, "ctr": 1.2, "conversions": 96, "conversionRate": 3.0, "status": "Completed" },
    { "id": 12, "name": "Influencer Collaboration", "channel": "Social Media", "spend": 25000, "clicks": 16800, "cpc": 1.49, "ctr": 5.5, "conversions": 672, "conversionRate": 4.0, "status": "Active" }
  ]
};

// Global Variables
let currentPage = 1;
let itemsPerPage = 10;
let filteredData = [...dashboardData.campaignsData];
let sortColumn = '';
let sortDirection = 'asc';
let charts = {};
let currentSection = 'overview';

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function formatPercentage(num, decimals = 1) {
    return `${num.toFixed(decimals)}%`;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast hidden';
    }, 3000);
}

// Loading Management
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Section Management
function showSection(sectionName) {
    currentSection = sectionName.toLowerCase();
    
    // Show/hide sections based on current section
    const dashboard = document.querySelector('.dashboard');
    
    if (sectionName.toLowerCase() === 'overview') {
        dashboard.style.display = 'block';
        showToast('Viewing Dashboard Overview');
    } else {
        dashboard.style.display = 'block'; // Keep dashboard visible for demo
        showToast(`Navigated to ${sectionName} section`);
    }
}

// KPI Cards Animation
function animateKPICards() {
    const kpiCards = [
        {
            skeleton: 'revenueSkeleton',
            content: 'revenueContent',
            value: 'revenueValue',
            change: 'revenueChange',
            data: dashboardData.dashboardMetrics.revenue
        },
        {
            skeleton: 'usersSkeleton',
            content: 'usersContent',
            value: 'usersValue',
            change: 'usersChange',
            data: dashboardData.dashboardMetrics.users
        },
        {
            skeleton: 'conversionsSkeleton',
            content: 'conversionsContent',
            value: 'conversionsValue',
            change: 'conversionsChange',
            data: dashboardData.dashboardMetrics.conversions
        },
        {
            skeleton: 'growthSkeleton',
            content: 'growthContent',
            value: 'growthValue',
            change: 'growthChange',
            data: dashboardData.dashboardMetrics.growthRate
        }
    ];

    kpiCards.forEach((card, index) => {
        setTimeout(() => {
            const skeleton = document.getElementById(card.skeleton);
            const content = document.getElementById(card.content);
            const valueEl = document.getElementById(card.value);
            const changeEl = document.getElementById(card.change);

            skeleton.classList.add('hidden');
            content.classList.remove('hidden');
            content.classList.add('fade-in');

            // Update values
            if (card.value === 'revenueValue') {
                valueEl.textContent = formatCurrency(card.data.value);
            } else if (card.value === 'usersValue' || card.value === 'conversionsValue') {
                valueEl.textContent = formatNumber(card.data.value);
            } else {
                valueEl.textContent = formatPercentage(card.data.value);
            }

            const changeIcon = card.data.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
            const changeClass = card.data.trend === 'up' ? 'positive' : 'negative';
            const changeSign = card.data.trend === 'up' ? '+' : '-';
            
            changeEl.innerHTML = `
                <i class="fas ${changeIcon}"></i>
                ${changeSign}${formatPercentage(Math.abs(card.data.change))} from last month
            `;
            changeEl.className = `kpi-change ${changeClass}`;
        }, index * 300);
    });
}

// Chart Creation
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dashboardData.revenueData.labels,
            datasets: [{
                label: 'Revenue',
                data: dashboardData.revenueData.data,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                borderWidth: 3,
                fill: true,
                pointBackgroundColor: '#1FB8CD',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#1FB8CD',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return 'Revenue: ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function createChannelChart() {
    const ctx = document.getElementById('channelChart').getContext('2d');
    
    charts.channel = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dashboardData.campaignPerformance.labels,
            datasets: [{
                label: 'Conversions',
                data: dashboardData.campaignPerformance.conversions,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                borderWidth: 1,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#1FB8CD',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return 'Conversions: ' + formatNumber(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createTrafficChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    
    charts.traffic = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: dashboardData.trafficSources.labels,
            datasets: [{
                data: dashboardData.trafficSources.data,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#1FB8CD',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Table Management
function getChannelTagClass(channel) {
    const channelMap = {
        'Social Media': 'social-media',
        'Email': 'email',
        'Search': 'search',
        'Display': 'display',
        'Video': 'video',
        'Audio': 'audio'
    };
    return channelMap[channel] || 'social-media';
}

function getStatusBadgeClass(status) {
    const statusMap = {
        'Active': 'active',
        'Paused': 'paused',
        'Draft': 'draft',
        'Completed': 'completed'
    };
    return statusMap[status] || 'active';
}

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    tableBody.innerHTML = pageData.map(campaign => `
        <tr>
            <td>${campaign.name}</td>
            <td>
                <span class="channel-tag ${getChannelTagClass(campaign.channel)}">
                    ${campaign.channel}
                </span>
            </td>
            <td>${formatCurrency(campaign.spend)}</td>
            <td>${formatNumber(campaign.clicks)}</td>
            <td>${formatCurrency(campaign.cpc)}</td>
            <td>${formatPercentage(campaign.ctr)}</td>
            <td>${formatNumber(campaign.conversions)}</td>
            <td>${formatPercentage(campaign.conversionRate)}</td>
            <td>
                <span class="status-badge ${getStatusBadgeClass(campaign.status)}">
                    ${campaign.status}
                </span>
            </td>
        </tr>
    `).join('');

    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);

    pagination.innerHTML = `
        <div class="pagination-info">
            Showing ${startItem}-${endItem} of ${filteredData.length} campaigns
        </div>
        <div class="pagination-controls">
            <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
            ${generatePageNumbers(totalPages)}
            <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
}

function generatePageNumbers(totalPages) {
    let pages = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    return pages;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
    }
}

function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    filteredData.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];

        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    currentPage = 1;
    renderTable();
    updateSortIndicators();
    
    showToast(`Sorted by ${column} (${sortDirection}ending)`);
}

function updateSortIndicators() {
    document.querySelectorAll('.data-table th i').forEach(icon => {
        icon.className = 'fas fa-sort';
    });

    if (sortColumn) {
        const header = document.querySelector(`[data-sort="${sortColumn}"] i`);
        if (header) {
            header.className = `fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`;
        }
    }
}

function filterTable() {
    const searchTerm = document.getElementById('tableSearch').value.toLowerCase();
    const channelFilter = document.getElementById('channelFilter').value;

    filteredData = dashboardData.campaignsData.filter(campaign => {
        const matchesSearch = !searchTerm || 
            campaign.name.toLowerCase().includes(searchTerm) ||
            campaign.channel.toLowerCase().includes(searchTerm) ||
            campaign.status.toLowerCase().includes(searchTerm);
        
        const matchesChannel = !channelFilter || campaign.channel === channelFilter;

        return matchesSearch && matchesChannel;
    });

    currentPage = 1;
    renderTable();
    
    if (searchTerm || channelFilter) {
        showToast(`Filtered: ${filteredData.length} campaigns found`);
    }
}

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-color-scheme', newTheme);
    
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Update charts for theme change
    setTimeout(() => {
        Object.values(charts).forEach(chart => {
            if (chart) {
                chart.update();
            }
        });
    }, 100);
    
    showToast(`Switched to ${newTheme} mode`);
}

// Sidebar Management
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebar.classList.toggle('show');
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// Export Functions
function exportToPDF() {
    showToast('PDF export started. Download will begin shortly.');
    // Simulate PDF generation
    setTimeout(() => {
        showToast('PDF export completed successfully!');
    }, 2000);
}

function exportToCSV() {
    showToast('CSV export started. Download will begin shortly.');
    // Simulate CSV generation with actual data
    const csvData = filteredData.map(campaign => ({
        'Campaign Name': campaign.name,
        'Channel': campaign.channel,
        'Spend': campaign.spend,
        'Clicks': campaign.clicks,
        'CPC': campaign.cpc,
        'CTR': campaign.ctr,
        'Conversions': campaign.conversions,
        'Conversion Rate': campaign.conversionRate,
        'Status': campaign.status
    }));
    
    setTimeout(() => {
        showToast('CSV export completed successfully!');
    }, 1500);
}

// Real-time Updates
function startRealTimeUpdates() {
    setInterval(() => {
        // Simulate small changes in metrics
        const metrics = [
            { id: 'revenueValue', type: 'currency', current: dashboardData.dashboardMetrics.revenue.value },
            { id: 'usersValue', type: 'number', current: dashboardData.dashboardMetrics.users.value },
            { id: 'conversionsValue', type: 'number', current: dashboardData.dashboardMetrics.conversions.value }
        ];
        
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        const element = document.getElementById(randomMetric.id);
        
        if (element) {
            const change = Math.floor(Math.random() * 200) - 100; // Random change between -100 and +100
            const newValue = Math.max(0, randomMetric.current + change);
            
            if (randomMetric.type === 'currency') {
                element.textContent = formatCurrency(newValue);
                dashboardData.dashboardMetrics.revenue.value = newValue;
            } else {
                element.textContent = formatNumber(newValue);
                if (randomMetric.id === 'usersValue') {
                    dashboardData.dashboardMetrics.users.value = newValue;
                } else {
                    dashboardData.dashboardMetrics.conversions.value = newValue;
                }
            }
            
            // Add a subtle flash effect
            element.style.color = '#1FB8CD';
            setTimeout(() => {
                element.style.color = '';
            }, 1000);
        }
    }, 30000); // Update every 30 seconds
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme to light mode by default
    document.documentElement.setAttribute('data-color-scheme', 'light');
    
    // Show loading
    showLoading();
    
    // Initialize dashboard after delay to show loading
    setTimeout(() => {
        hideLoading();
        animateKPICards();
        
        // Initialize charts after KPI cards animation
        setTimeout(() => {
            createRevenueChart();
            createChannelChart();
            createTrafficChart();
            renderTable();
        }, 1200);
        
        // Start real-time updates
        startRealTimeUpdates();
    }, 2000);

    // Sidebar controls
    const menuToggle = document.getElementById('menuToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Theme toggle - Make sure it works
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
        });
    }

    // Export buttons
    const exportPDF = document.getElementById('exportPDF');
    const exportCSV = document.getElementById('exportCSV');
    
    if (exportPDF) {
        exportPDF.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            exportToPDF();
        });
    }
    
    if (exportCSV) {
        exportCSV.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            exportToCSV();
        });
    }

    // Table controls
    const tableSearch = document.getElementById('tableSearch');
    const channelFilter = document.getElementById('channelFilter');
    
    if (tableSearch) {
        tableSearch.addEventListener('input', filterTable);
    }
    
    if (channelFilter) {
        channelFilter.addEventListener('change', filterTable);
    }

    // Table sorting - Use direct event listeners to avoid navigation conflicts
    setTimeout(() => {
        const sortableHeaders = document.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const column = this.getAttribute('data-sort');
                if (column) {
                    sortTable(column);
                }
            });
        });
    }, 1500); // Wait for table to be rendered

    // Date range change
    const dateRange = document.getElementById('dateRange');
    if (dateRange) {
        dateRange.addEventListener('change', function() {
            const selectedRange = this.value;
            showToast(`Date range updated to ${this.options[this.selectedIndex].text}. Refreshing data...`);
            
            // Simulate data refresh with loading
            setTimeout(() => {
                // Simulate slight changes in chart data
                dashboardData.revenueData.data = dashboardData.revenueData.data.map(value => 
                    Math.max(0, value + (Math.random() * 20000 - 10000))
                );
                
                // Update charts
                if (charts.revenue) {
                    charts.revenue.data.datasets[0].data = dashboardData.revenueData.data;
                    charts.revenue.update();
                }
                
                showToast('Data refreshed successfully!');
            }, 1500);
        });
    }

    // Navigation items click handling - Use specific event listeners
    setTimeout(() => {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(navItem => {
            navItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                const sectionName = this.querySelector('span').textContent;
                showSection(sectionName);
            });
        });
    }, 500);

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        const sidebarToggle = document.getElementById('sidebarToggle');
        
        if (window.innerWidth <= 768 && 
            sidebar && !sidebar.contains(event.target) && 
            event.target !== menuToggle && 
            event.target !== sidebarToggle &&
            (!menuToggle || !menuToggle.contains(event.target)) &&
            (!sidebarToggle || !sidebarToggle.contains(event.target))) {
            sidebar.classList.remove('show');
            sidebar.classList.add('collapsed');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.querySelector('.main-content');
            if (sidebar) {
                sidebar.classList.remove('show', 'collapsed');
            }
            if (mainContent) {
                mainContent.classList.remove('expanded');
            }
        }
        
        // Resize charts
        Object.values(charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case 'd':
                    event.preventDefault();
                    toggleTheme();
                    break;
                case 'k':
                    event.preventDefault();
                    const searchInput = document.querySelector('.search-input');
                    if (searchInput) {
                        searchInput.focus();
                    }
                    break;
            }
        }
        
        if (event.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('show')) {
                toggleSidebar();
            }
        }
    });

    // Header search functionality
    const headerSearch = document.querySelector('.header .search-input');
    if (headerSearch) {
        headerSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm) {
                showToast(`Searching for: ${searchTerm}`);
                // Simulate search results
                setTimeout(() => {
                    showToast(`Found results for: ${searchTerm}`);
                }, 1000);
            }
        });
    }
});

// Expose functions to global scope for inline event handlers
window.changePage = changePage;
window.sortTable = sortTable;