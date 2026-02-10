const API_URL = '/items';

const itemForm = document.getElementById('addItemForm');
const itemsGrid = document.getElementById('itemsGrid');
const formMessage = document.getElementById('formMessage');
const refreshBtn = document.getElementById('refreshBtn');

// Load items on startup
document.addEventListener('DOMContentLoaded', fetchItems);

// Refresh button
refreshBtn.addEventListener('click', () => {
    animateRefresh();
    fetchItems();
});

// Search functionality
const searchBtn = document.getElementById('searchBtn');
const searchResult = document.getElementById('searchResult');

searchBtn.addEventListener('click', async () => {
    const id = document.getElementById('searchId').value.trim();
    if (!id) return;

    searchResult.innerHTML = '<div class="loader">Scanning...</div>';

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (response.ok) {
            const item = await response.json();
            searchResult.innerHTML = `
                <div class="item-card" style="margin-top: 1rem; border-color: var(--success-color);">
                    <h3>${escapeHtml(item.name)}</h3>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                    <p class="item-desc">${escapeHtml(item.description || "No description provided.")}</p>
                    <span class="item-id">ID: ${item.id}</span>
                </div>
            `;
        } else {
            searchResult.innerHTML = '<div class="message error">Artifact Not Found (404)</div>';
        }
    } catch (err) {
        searchResult.innerHTML = `<div class="message error">Error: ${err.message}</div>`;
    }
});

// Submit Form
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const newItem = await response.json();
            showMessage('Item deployed successfully!', 'success');
            itemForm.reset();
            fetchItems(); // Refresh list
        } else {
            const error = await response.json();
            // Handle validation errors from backend
            let errorMsg = 'Failed to add item.';
            if (typeof error === 'object') {
                errorMsg = Object.values(error).join(', ');
            }
            showMessage(errorMsg, 'error');
        }
    } catch (err) {
        showMessage('Connection error: ' + err.message, 'error');
    } finally {
        setLoading(false);
    }
});

async function fetchItems() {
    itemsGrid.innerHTML = '<div class="loader">Scanning system...</div>';

    try {
        const response = await fetch(API_URL);
        const items = await response.json();

        displayItems(items);
    } catch (err) {
        itemsGrid.innerHTML = `<div class="message error">System Offline: ${err.message}</div>`;
    }
}

function displayItems(items) {
    itemsGrid.innerHTML = '';

    // Update badge
    const countBadge = document.getElementById('itemCount');
    if (countBadge) {
        countBadge.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
    }

    if (items.length === 0) {
        itemsGrid.innerHTML = '<div class="message" style="grid-column: 1/-1;">No items in inventory.</div>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <h3>${escapeHtml(item.name)}</h3>
            <div class="item-price">$${item.price.toFixed(2)}</div>
            <p class="item-desc">${escapeHtml(item.description || "No description provided.")}</p>
            <span class="item-id" onclick="copyToClipboard('${item.id}', this)" title="Click to copy ID">ID: ${item.id.substring(0, 8)}...</span>
        `;
        itemsGrid.appendChild(card);
    });
}

function copyToClipboard(text, element) {
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        element.classList.add('copied');
        setTimeout(() => element.classList.remove('copied'), 2000);

        // Auto-fill transparency
        const searchInput = document.getElementById('searchId');
        if (searchInput) {
            searchInput.value = text;
            searchInput.focus();

            // Optional: Auto-trigger search?
            // document.getElementById('searchBtn').click();
        }
    });
}

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `message ${type}`;
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'message';
    }, 5000);
}

function setLoading(isLoading) {
    const btn = document.getElementById('submitBtn');
    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = 'Initializing...';
        btn.style.opacity = '0.7';
    } else {
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-text">Initialize Item</span><div class="btn-glitch"></div>';
        btn.style.opacity = '1';
    }
}

function animateRefresh() {
    refreshBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
    }, 500);
}

// Security: Escape HTML to detect XSS (though backend handles basic hygiene, good to do here too)
function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
