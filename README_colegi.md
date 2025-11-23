## Ghid rapid pentru colegi

Acest document este un rezumat narativ al aplicației **Todo App v3** astfel încât fiecare coleg din echipă să poată explica o bucată de cod fără să fie expert în React. Fiecare secțiune include:
- logica de bază (ce problemă rezolvă);
- componentele implicate și cum colaborează;
- idei de “cum povestesc asta la prezentare”.

---

## 1. Cum este structurată aplicația

- **Tehnologii**: React + TypeScript, Vite pentru bundling, Tailwind pentru stiluri, biblioteca de UI `shadcn/ui`, Supabase pentru autentificare + CRUD în baza de date.
- **Punct de intrare**: `src/main.tsx` montează aplicația și împachetează totul cu doi provideri React:
  - `AuthProvider` (gestionează login-ul, profilul, sesiunea);
  - `DataProvider` (ținut toate task-urile și categoriile sincronizate).
- **Componenta principală**: `src/App.tsx` decide ce văd utilizatorii: spinner de loading, pagina de login sau dashboard.

> Idee de prezentare: “Aplicatia este împărțită în două contexte globale: unul de autentificare și unul de date. Toate componentele folosesc doar hook-urile acestor contexte, ceea ce simplifică logica.”

---

## 2. Fluxul de autentificare (`AuthContext`)

Fișier: `src/contexts/AuthContext.tsx`

- **Ce face**: creează un context React care expune `user`, `profile`, `session`, `loading` și funcțiile de login/logout/update profile.
- **Cum funcționează**:
  1. La montare se apelează `supabase.auth.getSession()`; dacă durează prea mult, există un timeout care forțează continuarea (important în demo-uri atunci când Supabase răspunde lent).
  2. Când se primește sesiunea, dacă există `user`, se încarcă profilul (`profiles` table) și chiar se creează un profil fallback dacă nu există.
  3. Există subscription `supabase.auth.onAuthStateChange` care păstrează userul sincronizat.
  4. Expune metode: `signInWithGoogle`, `signInWithEmail`, `signUpWithEmail`, `signOut`, `updateProfile`.

> Ce să spui: “AuthContext e creierul autentificării. Îl folosim în `App.tsx` și în `Header`/`ProfileDialog` pentru a afișa datele utilizatorului și pentru a avea login/out la un singur click.”

---

## 3. Fluxul de date (`DataContext`)

Fișier: `src/contexts/DataContext.tsx`

- **Ce ține**: `tasks`, `categories`, `loading`, `error`, plus toate operațiile CRUD pentru task-uri și categorii.
- **Pași importanți**:
  1. Așteaptă `user` din `AuthContext`. Dacă nu există, golește datele.
  2. La prima încărcare verifică dacă există o categorie default (“General”); dacă nu, o creează automat.
  3. Load paralel pentru categorii și task-uri, cu timeouts scurte astfel încât UI-ul să nu rămână blocat.
  4. Setează două subscription-uri realtime (Supabase `postgres_changes`) pentru tabelele `tasks` și `categories`. Orice modificare din altă fereastră resetează datele local.
  5. Operațiile `addTask`, `updateTask`, `deleteTask`, `addCategory`, `updateCategory`, `deleteCategory` fac refresh după succes pentru a ține starea consistentă.

> Ce să spui: “DataContext acționează ca un mini-store. Componentele nu vorbesc direct cu Supabase, ci doar apelează metodele din context. Asta face testarea și refactorizarea mult mai ușoare.”

---

## 4. Controlul vizual: `App` și `Dashboard`

- `App.tsx`:
  - ascultă `loading`, `user`, `forceShowApp`;
  - afișează spinner, pagina de login sau `Dashboard`.
- `Dashboard.tsx`:
  - ține `activeSection` (`home`, `tasks`, `reports`, `guide`) și `taskFilter`;
  - include `Header`, `MainSidebar` și zona principală unde se redă secțiunea activă;
  - rulează pe toată înălțimea ecranului și gestionează toggling-ul de sidebar pe mobile.

> Cum prezinți: “Dashboard-ul e orchestratorul de ecran: primește input-ul de la sidebar și trimite mai departe către secțiuni. De exemplu, dacă apăs ‘Today’, state-ul `activeSection` devine `tasks` iar `taskFilter` primește `today`, ceea ce ajunge în `TasksSection`.”

---

## 5. Componente transversale

| Componentă | Rol | Fișier |
| --- | --- | --- |
| `Header` | Afișează logo, butonul de deschidere sidebar (mobil), avatar + dropdown cu “Edit Profile” și `signOut`. | `src/components/Header.tsx` |
| `ProfileDialog` | Form pentru update nume, avatar, telefon (cu validare). Apelă `updateProfile` din `AuthContext`. | `src/components/ProfileDialog.tsx` |
| `MainSidebar` | Lista principală de secțiuni (Home/Tasks/Reports/Guide) + logică de slide-in pe mobil. | `src/components/Layout/MainSidebar.tsx` |
| `Login` | Card cu login Google + email/parolă (folosește `useAuth`). | `src/components/Login.tsx` |

> Tip: fiecare coleg poate prezenta una din aceste componente pentru că sunt independente și nu intră adânc în logica de task-uri.

---

## 6. Secțiunile mari ale dashboard-ului

### 6.1 `HomeSection`
- Folosește `useData` pentru a calcula statistici (Inbox, Today, Overdue, Completed, Tomorrow).
- Quick actions navighează spre `TasksSection` cu filtrul corespunzător.
- Listează top 5 categorii active și câteva tips card-uri.
- Greu de stricat la prezentare: doar citești ce date agregă și cum se generează interfața.

### 6.2 `TasksSection`
- Este cel mai complex modul. Ține în state:
  - `selectedCategory`, `viewMode` (`list`, `kanban`, `week`, `month`),
  - starea dialogurilor (`TaskDialog`, `CategoryDialog`),
  - ce task se editează (`editingTask`).
- Flow:
  1. Primește `initialFilter` din Dashboard și îl setează în `selectedCategory`.
  2. Calculează `filteredTasks` în funcție de tab-ul selectat (Inbox, Today, Completed, categorie).
  3. În UI avem:
     - buton de deschidere pentru `TasksSidebar` (pe mobil),
     - butoane pentru schimbarea view mode-ului,
     - `TaskList` / `KanbanView` / `WeekView` / `MonthView` randate condiționat.
  4. `TaskDialog` și `CategoryDialog` sunt montate o singură dată și primesc `open/onOpenChange`.

### 6.3 `ReportsSection`
- Își construiește statisticile locale pe baza listei de tasks.
- Calcul pentru completion rate, compară date pe zi/săptămână/lună, arată grafice “progress bar” folosind doar div-uri cu Tailwind.

### 6.4 `GuideSection`
- Este pur statică. Carduri cu pași, tips, secțiuni cu iconițe (ușor de prezentat de cineva care nu vrea să intre în cod).

---

## 7. Detaliu pe modulul Tasks

### 7.1 `TasksSidebar`
- Afișează “Views” (Inbox, Today, Scheduled, Done) + lista de categorii din baza de date.
- Fiecare buton calculează dinamic câte task-uri active are filtrul respectiv (`getTaskCount`).
- Oferă buton `Manage Categories` care deschide `CategoryDialog`.
- Pe mobil se comportă ca un drawer (folosește clase `translate-x`).

### 7.2 `TaskList`
- Primește `tasks` deja filtrate și `showCompleted`.
- Împarte task-urile în active vs. complete și apoi le grupează pe zile (“Today”, “Tomorrow”, “Overdue”, etc.).
- Fiecare task este randat cu `TaskCard` (default variant) și oferă buton de editare.
- Are un mini-accordion pentru a ascunde/arăta secțiunea de “Completed”.

### 7.3 `TaskCard`
- Reprezintă un task în mai multe stiluri (`variant`: list, kanban, week, month).
- Se ocupă de:
  - toggling status (checkbox -> `updateTask`),
  - delete cu confirmare,
  - afișarea badge-ului de due date (Today, Tomorrow, Overdue...).
- Exemplu de explicație: “TaskCard știe să-și adapteze layout-ul pentru view-urile Kanban/Week/Month. În variantă list afișează toate detaliile + butoane de edit/delete; în variantă week se reduce la un rând compact cu un bullet colorat.”

### 7.4 `TaskDialog`
- Folosit atât pentru creare cât și pentru editare (dacă primește `task` prop).
- Pre-populează câmpurile pentru edit, resetează formularul după submit.
- Are pickere custom pentru dată (`Calendar`) și oră (`TimePicker`).
- După salvare apelează `addTask` sau `updateTask` din context și închide dialogul.

### 7.5 `CategoryDialog`
- Gestionează CRUD pentru categorii, cu paletă presetată de culori.
- Nu permite ștergerea categoriei default și mută task-urile categoriei șterse în “General”.
- Permite edit inline (nume + culoare) pentru fiecare categorie nerestricționată.

### 7.6 `KanbanView`, `WeekView`, `MonthView`
- `KanbanView`: împarte task-urile în coloane logice (Overdue/Today/Upcoming/Completed) și permite drag & drop (doar la nivel de status, fără reorder). Mutarea într-o coloană actualizează status-ul prin `updateTask`.
- `WeekView`: distribuie task-urile pe zilele săptămânii curente (folosește `date-fns`). În interiorul fiecărei celule folosește `TaskCard` cu `variant="week"`.
- `MonthView`: randază o grilă lunară cu highlight pe data curentă și lista scurtă de task-uri din fiecare zi. (Fișierul `Monthview.tsx` descrie logica de generare a calendarului.)

> Sfat prezentare: fiecare view poate fi prezentat ca “aceeași listă de tasks, alt mod de a o vizualiza” – nu intri în detalii de drag&drop dacă nu vrei.

---

## 8. Cum curge aplicația – scenarii de povestit

1. **Autentificare + load date**
   - `App.tsx` apelează `useAuth` → dacă `loading`, afișează spinner.
   - După login, `AuthProvider` furnizează `user`, iar `DataProvider` pornește încărcarea pentru tasks/categorii.
   - `Dashboard` devine vizibil și poate folosi datele prin `useData`.

2. **Crearea unui task**
   - Utilizatorul apasă “Add Task” în `TasksSection`.
   - Se deschide `TaskDialog`, fields sunt validate, la submit se apelează `addTask`.
   - `DataContext` inserează în Supabase și cheamă `refreshData`, astfel încât `tasks` se actualizează în toată aplicația.

3. **Editarea profilului**
   - Din `Header` → dropdown → “Edit Profile”.
   - `ProfileDialog` își ia valorile curente din `useAuth`, validează telefonul și apelează `updateProfile`.
   - `AuthContext` face update în tabela `profiles` și refetch.

4. **Raportare & vizualizare**
   - Din `MainSidebar` se alege “Reports”.
   - `ReportsSection` recalculează statisticile de fiecare dată când `tasks` se schimbă (prin `useData`), deci datele sunt mereu sincronizate.

---

## 9. Cum împărțiți prezentarea

| Coleg | Zone sugerate |
| --- | --- |
| Persoana 1 | `AuthContext`, `App`, `Login` (explică fluxul de autentificare). |
| Persoana 2 | `DataContext`, `TasksSidebar`, `TaskDialog` (focus pe CRUD și filtre). |
| Persoana 3 | `TaskList` + `TaskCard` + `KanbanView` (cum se randază și se schimbă statusul). |
| Persoana 4 | `Dashboard`, `HomeSection`, `ReportsSection`, `GuideSection` (navigație + statistici + pagini statice). |

> Ideal: fiecare coleg arată o componentă “ancoră” + cum folosește contextul (ex. “iau `tasks` din `useData` și le grupez așa…”).

---

## 10. Checklist pentru demo

- `.env` conține `VITE_SUPABASE_URL` și `VITE_SUPABASE_ANON_KEY`.
- Rulăm `npm install` și `npm run dev`.
- Contul de test are deja câteva task-uri pentru a popula dashboard-ul.
- Verificați că butoanele “Manage Categories” și “Add Task” funcționează (sunt cele mai folosite în demo).
- Dacă Supabase e lent, menționați că există timeouts care evită blocajele (vezi comentariile cu emoji în cod).

---

## 11. Glosar de hook-uri și utilitare

- `useAuth()` – vine din `AuthContext`, returnează user, profile și funcții de login.
- `useData()` – vine din `DataContext`, returnează tasks/categorii + metode CRUD.
- `cn()` – helper pentru concatenare de clase (vezi `src/lib/utils.ts`).
- Componente din `components/Shadcn/` sunt wrappers peste design system shadcn; nu au logică de business, doar UI.

---

### Întrebări frecvente

- **Unde se configurează Supabase?** `src/config/supabase.ts`.
- **Ce fac tipurile?** `src/types/index.ts` definește `Task`, `Category`, `UserProfile`, etc., folosite în tot proiectul.
- **Ce fac dacă apare eroare la categories?** `ensureDefaultCategory` creează automat categoria “General”; dacă lipsește, verificați log-urile din consolă.

---

> Dacă aveți altă întrebare, căutați numele fișierului în repo sau întrebați colegul care a prezentat secțiunea respectivă. Scopul aplicației este să ofere un mod clar de a crea task-uri, a le grupa pe categorii și a vedea progresul – tot restul sunt detalii de UI și integrare cu Supabase.


