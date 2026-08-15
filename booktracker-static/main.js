document.addEventListener('DOMContentLoaded', () => {
  const books = window.BOOKS || [];
  const byId = id => books.find(b => String(b.id) === String(id)) || books[0];
  const params = new URLSearchParams(location.search);

  // Original home modal behaviour.
  const modal = document.getElementById('demoModal');
  if (modal) {
    modal.style.display = 'block';
    const close = modal.querySelector('.close');
    if (close) close.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
  }

  // Swiper discovery carousel, when CDN is available.
  if (document.querySelector('.swiper-container') && window.Swiper) {
    new Swiper('.swiper-container', {initialSlide: 2, slidesPerView: 3, spaceBetween: 30, pagination:{el:'.swiper-pagination',clickable:true}, autoplay:{delay:2500,disableOnInteraction:false}, speed:600, breakpoints:{320:{slidesPerView:1},499:{slidesPerView:2},999:{slidesPerView:3}}});
  }

  // Header live search, completely local.
  const search = document.getElementById('book-search');
  const results = document.getElementById('search-results');
  if (search && results) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      if (!q) { results.innerHTML=''; results.style.display='none'; return; }
      const found = books.filter(b => `${b.title} ${b.author} ${b.genres}`.toLowerCase().includes(q)).slice(0,6);
      results.innerHTML = found.length ? found.map(b => `<a class="search-result-item" href="book.html?id=${b.id}">${b.title} by ${b.author}</a>`).join('') : '<div class="search-result-item">No results found</div>';
      results.style.display = 'block';
    });
    const form = search.closest('form');
    if (form) form.addEventListener('submit', e => { e.preventDefault(); location.href = `search.html?q=${encodeURIComponent(search.value)}`; });
  }

  // Auth screens simply enter the dummy authenticated UI.
  document.querySelector('.static-login-form')?.addEventListener('submit', e => { e.preventDefault(); location.href='dashboard.html'; });
  document.querySelector('.static-signup-form')?.addEventListener('submit', e => { e.preventDefault(); location.href='dashboard.html'; });

  // Password matching kept client-side.
  const p1=document.getElementById('id_password1'), p2=document.getElementById('id_password2'), pe=document.getElementById('passwordError');
  function checkPasswords(){ if(!p1||!p2||!pe)return; pe.textContent = p1.value && p2.value && p1.value!==p2.value ? "Passwords don't match." : ''; }
  p1?.addEventListener('input',checkPasswords); p2?.addEventListener('input',checkPasswords);

  // Reading challenge.
  document.getElementById('reading-challenge-form')?.addEventListener('submit', e => { e.preventDefault(); const goal=Math.max(1,Number(e.target.new_goal.value)||1); document.getElementById('reading-goal').textContent=goal; const progress=Number(document.getElementById('reading-progress').textContent)||0; const congrats=document.getElementById('congratulations-message'); if(congrats) congrats.style.display=progress>=goal?'block':'none'; });

  // Quick notes.
  document.getElementById('quick-notes-form')?.addEventListener('submit', e => { e.preventDefault(); const input=document.getElementById('quick-note'); if(!input?.value.trim())return; const node=document.createElement('div'); node.className='quick-note'; node.innerHTML=`<p>${escapeHtml(input.value.trim())}</p><span class="timestamp">Just now</span>`; document.getElementById('quick-notes-list')?.prepend(node); input.value=''; });

  // My Books local status/progress interactions.
  document.querySelectorAll('.static-read-status-form').forEach(form => {
    const item=form.closest('.book-item'); const id=item?.dataset.bookId; const selector=form.querySelector('.read-status-selector'); const progress=form.querySelector('.reading-progress-input'); const bar=form.querySelector('.progress-bar');
    const sync=()=>{ let v=Math.max(0,Math.min(100,Number(progress.value)||0)); if(selector.value==='Completed') v=100; if(selector.value==='Not Started') v=0; progress.value=v; if(bar)bar.style.width=v+'%'; };
    selector?.addEventListener('change',sync); progress?.addEventListener('input',sync); form.addEventListener('submit',e=>{e.preventDefault();sync();});
  });
  document.querySelectorAll('.toggle-visibility').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault(); const hidden=btn.textContent.trim()==='Hide'; btn.textContent=hidden?'Display':'Hide'; btn.classList.toggle('btn-danger',!hidden); btn.classList.toggle('btn-primary',hidden);}));

  // Book detail, edit, delete and share all render from query-string sample data.
  const selected = byId(params.get('id') || 1);
  const set=(id,val)=>{const el=document.getElementById(id); if(el)el.textContent=val;};
  if (document.getElementById('book-detail-page')) {
    const cover=document.getElementById('detail-cover'); cover.src=selected.cover; cover.alt=`Cover image for ${selected.title}`;
    set('detail-title',selected.title);set('detail-author',selected.author);set('detail-isbn',selected.isbn);set('detail-date',selected.date);set('detail-pages',selected.pages);set('detail-genres',selected.genres);set('detail-summary',selected.summary);set('detail-read',selected.status==='Completed'?'Yes':'No');
    document.getElementById('share-card-link').href=`shareable-book-card.html?id=${selected.id}`; document.getElementById('edit-book-link').href=`edit-book.html?id=${selected.id}`; document.getElementById('remove-book-link').href=`remove-book.html?id=${selected.id}`;
  }
  const editMap={title:'edit-title',author:'edit-author',isbn:'edit-isbn',pages:'edit-pages',date:'edit-date',summary:'edit-summary'};
  Object.entries(editMap).forEach(([key,id])=>{const el=document.getElementById(id); if(el) el.value=selected[key];});
  document.querySelector('.static-edit-book-form')?.addEventListener('submit',e=>{e.preventDefault();location.href=`book.html?id=${selected.id}`;});
  set('remove-title',selected.title);
  document.querySelector('.static-delete-form')?.addEventListener('submit',e=>{e.preventDefault();location.href='books.html';});

  // Review submission stays entirely in the DOM.
  document.querySelector('.review-form')?.addEventListener('submit',e=>{e.preventDefault(); const comment=document.getElementById('review-comment'); if(!comment?.value.trim())return; const rating=e.target.querySelector('input[name=rating]:checked')?.value||5; const rev=document.createElement('div'); rev.className='review'; rev.innerHTML=`<p><strong>bug:</strong> ${escapeHtml(comment.value.trim())} (Rating: ${rating})</p><p class="review-date">Date: 2026-08-15</p>`; document.getElementById('reviews')?.appendChild(rev); comment.value=''; });

  // Add Book: simulate the Open Library fetch with known sample data.
  document.getElementById('fetch-book-form')?.addEventListener('submit',e=>{e.preventDefault(); const isbn=document.getElementById('isbn').value.trim(); const b=books.find(x=>x.isbn===isbn)||books[0]; document.getElementById('fetched-cover').src=b.cover; document.getElementById('fetched-cover').style.display='block'; document.getElementById('fetch-message').innerHTML='<div class="alert alert-info">Book details fetched for the static demonstration.</div>'; document.getElementById('add-title').value=b.title; document.getElementById('add-author').value=b.author; document.getElementById('add-isbn').value=b.isbn; document.getElementById('add-pages').value=b.pages; document.getElementById('add-date').value=b.date; document.getElementById('add-summary').value=b.summary; });
  document.querySelector('.static-add-book-form')?.addEventListener('submit',e=>{e.preventDefault();location.href='books.html';});

  // Profile-related static actions.
  document.querySelector('.static-edit-profile-form')?.addEventListener('submit',e=>{e.preventDefault();location.href='dashboard.html';});
  document.querySelectorAll('.static-add-list').forEach(btn=>btn.addEventListener('click',()=>{btn.textContent='This book is in your list.';btn.disabled=true;}));

  // Search result page.
  const searchList=document.getElementById('static-search-list');
  if(searchList){ const q=(params.get('q')||'').trim().toLowerCase(); const found=q?books.filter(b=>`${b.title} ${b.author} ${b.genres}`.toLowerCase().includes(q)):books; searchList.innerHTML=found.map(b=>`<li class="book-item"><img src="${b.cover}" alt="Cover image for ${escapeHtml(b.title)}" class="book-cover"><div class="book-details"><h3>${escapeHtml(b.title)}</h3><p class="author">Author: ${escapeHtml(b.author)}</p><p class="isbn">ISBN: ${b.isbn}</p><p class="publication-date">Publication Date: ${b.date}</p><p class="genres"><strong>Genres:</strong> ${escapeHtml(b.genres)}</p><p class="pages">Pages: ${b.pages}</p><p class="summary">Summary: ${escapeHtml(b.summary)}</p><a href="book.html?id=${b.id}" class="link-style">View details</a> <button class="btn btn-secondary static-add-list">Add to My List</button></div></li>`).join(''); document.getElementById('static-search-empty').hidden=found.length>0; searchList.querySelectorAll('.static-add-list').forEach(btn=>btn.addEventListener('click',()=>{btn.textContent='Added';btn.disabled=true;})); }

  // Shareable card.
  if(document.getElementById('share-title')){set('share-title',selected.title);set('share-author',selected.author);set('share-summary',selected.summary);set('share-genres',selected.genres);const sc=document.getElementById('share-cover');sc.src=selected.cover;sc.alt=`Cover image for ${selected.title}`;document.getElementById('share-back').href=`book.html?id=${selected.id}`;}

  // Password reset sequence.
  document.querySelector('.static-password-reset-form')?.addEventListener('submit',e=>{e.preventDefault();location.href='password-reset-done.html';});
  document.querySelector('.static-password-confirm-form')?.addEventListener('submit',e=>{e.preventDefault();location.href='password-reset-complete.html';});
});
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));}
