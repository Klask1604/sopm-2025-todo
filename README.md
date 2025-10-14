#Denumire Branchuri 
## [initialaPrenume][numeFamilie] / feature
# ex : adoltu/adoption-page

# 📚 Git - Toate Comenzile Explicate Simplu

Un ghid complet pentru comenzile Git, explicat ca la prosti (fără supărare 😄).

## 🚀 Început de Drum

### `git init`
Inițializează un repository nou în folderul curent.
```bash
git init
```
**Ce face:** Transformă folderul curent într-un proiect Git. Creează un folder ascuns `.git` unde ține evidența tuturor schimbărilor.

### `git clone <url>`
Copiază un repository de pe internet pe calculatorul tău.
```bash
git clone https://github.com/username/repo.git
```
**Ce face:** Descarcă tot proiectul de pe GitHub/GitLab pe calculatorul tău, cu tot istoricul.

## 📝 Configurare

### `git config`
Setează numele și email-ul tău (să știe cine a făcut modificările).
```bash
git config --global user.name "Numele Tău"
git config --global user.email "email@example.com"
```
**Ce face:** Salvează datele tale în configurație. `--global` = pentru toate proiectele, fără `--global` = doar pentru proiectul curent.

### Vezi configurația
```bash
git config --list
```

## 💾 Salvarea Modificărilor

### `git status`
Arată ce s-a schimbat în proiect.
```bash
git status
```
**Ce face:** Îți spune ce fișiere ai modificat, ce e pregătit pentru commit, ce e netracked, etc.

### `git add`
Pregătește fișierele pentru a fi salvate (commit).
```bash
git add fisier.txt          # Adaugă un singur fișier
git add .                   # Adaugă TOATE fișierele modificate
git add *.js                # Adaugă toate fișierele .js
```
**Ce face:** Pune fișierele în "zona de staging" - ca o listă de cumpărături înainte să treci la casă.

### `git commit`
Salvează modificările cu un mesaj descriptiv.
```bash
git commit -m "Am adăugat funcția de login"
```
**Ce face:** Salvează definitiv modificările în istoric cu un mesaj care explică ce ai făcut.

**Commit rapid (add + commit):**
```bash
git commit -am "Mesaj rapid"
```
Funcționează doar pentru fișierele deja tracked.

## 🌿 Lucrul cu Branches (Ramuri)

### `git branch`
Lucrează cu ramuri (versiuni paralele ale proiectului).
```bash
git branch                  # Listează toate ramurile
git branch nume-branch      # Creează o ramură nouă
git branch -d nume-branch   # Șterge o ramură
git branch -m nume-nou      # Redenumește ramura curentă
```
**Ce face:** Ramurile îți permit să lucrezi la features noi fără să strici codul principal.

### `git checkout`
Schimbă ramura pe care lucrezi.
```bash
git checkout nume-branch              # Trece pe altă ramură
git checkout -b nume-branch-nou       # Creează și trece pe ramură nouă
git checkout fisier.txt               # Anulează modificările la un fișier
```

### `git switch` (mai nou, mai simplu)
```bash
git switch nume-branch        # Schimbă ramura
git switch -c nume-nou        # Creează și schimbă
```

### `git merge`
Combină o ramură cu ramura curentă.
```bash
git merge nume-branch
```
**Ce face:** Ia toate modificările dintr-o ramură și le aduce în ramura pe care ești.

## 🔄 Sincronizare cu Serverul

### `git remote`
Gestionează conexiunile la repository-uri remote.
```bash
git remote -v                           # Vezi la ce servere ești conectat
git remote add origin <url>             # Adaugă un server
git remote remove origin                # Șterge conexiunea
```

### `git push`
Trimite modificările tale pe server (GitHub/GitLab).
```bash
git push origin main                    # Trimite pe ramura main
git push origin nume-branch             # Trimite pe o altă ramură
git push -u origin main                 # Prima dată (setează upstream)
git push --force                        # ATENȚIE: Forțează (suprascrie serverul)
```

### `git pull`
Descarcă ultimele modificări de pe server.
```bash
git pull origin main
```
**Ce face:** Este un `git fetch` + `git merge` - adică descarcă și combină automat.

### `git fetch`
Descarcă modificările dar NU le combină automat.
```bash
git fetch origin
```
**Ce face:** Vezi ce s-a schimbat pe server fără să modifici codul tău local.

## 📜 Istoric și Informații

### `git log`
Arată istoricul commit-urilor.
```bash
git log                                 # Istoric complet
git log --oneline                       # Compact, pe o linie
git log --graph --oneline --all         # Grafic fancy
git log -n 5                            # Ultimele 5 commit-uri
git log --author="Numele"               # Commit-uri de la o persoană
```

### `git show`
Arată detalii despre un commit.
```bash
git show <commit-hash>
```

### `git diff`
Arată diferențele între fișiere.
```bash
git diff                                # Ce ai modificat dar nu ai adăugat (add)
git diff --staged                       # Ce ai pregătit pentru commit
git diff branch1 branch2                # Diferențe între ramuri
```

## ⏪ Anularea Lucrurilor

### `git restore`
Anulează modificări în fișiere.
```bash
git restore fisier.txt                  # Anulează modificările
git restore --staged fisier.txt         # Scoate din staging (undo add)
```

### `git reset`
Anulează commit-uri.
```bash
git reset HEAD~1                        # Anulează ultimul commit (păstrează modificările)
git reset --soft HEAD~1                 # Anulează commit (păstrează în staging)
git reset --hard HEAD~1                 # ATENȚIE: Șterge tot (nu se mai recuperează)
```

### `git revert`
Creează un commit nou care anulează unul vechi.
```bash
git revert <commit-hash>
```
**Ce face:** Mai sigur decât reset - nu șterge istoria, doar face undo public.

## 🏷️ Tag-uri (Etichete pentru Versiuni)

### `git tag`
Marchează puncte importante în istoric (ex: versiuni).
```bash
git tag                                 # Listează tag-urile
git tag v1.0.0                          # Creează tag simplu
git tag -a v1.0.0 -m "Versiunea 1.0"    # Tag cu mesaj
git push origin v1.0.0                  # Trimite tag-ul pe server
git push origin --tags                  # Trimite toate tag-urile
```

## 🔍 Alte Comenzi Utile

### `git stash`
Salvează temporar modificările fără să faci commit.
```bash
git stash                               # Ascunde modificările
git stash list                          # Vezi ce ai ascuns
git stash pop                           # Recuperează ultima ascunsă
git stash apply                         # Aplică fără să șteargă din stash
git stash drop                          # Șterge din stash
```
**Când e util:** Trebuie să schimbi ramura dar nu vrei să faci commit încă.

### `git clean`
Șterge fișierele netracked.
```bash
git clean -n                            # Vezi ce ar șterge (dry run)
git clean -f                            # Șterge fișierele
git clean -fd                           # Șterge și folderele
```

### `git rm`
Șterge fișiere din proiect.
```bash
git rm fisier.txt                       # Șterge și din disk
git rm --cached fisier.txt              # Șterge doar din Git, nu din disk
```

### `git mv`
Redenumește sau mută fișiere.
```bash
git mv fisier-vechi.txt fisier-nou.txt
```

## 🆘 Situații de Urgență

### Am făcut commit pe ramura greșită!
```bash
git log                                 # Copiază hash-ul commit-ului
git checkout ramura-corecta
git cherry-pick <commit-hash>           # Copiază commit-ul aici
git checkout ramura-gresita
git reset --hard HEAD~1                 # Șterge de pe ramura greșită
```

### Am făcut commit cu mesaj prost!
```bash
git commit --amend -m "Mesaj corect"
```

### Vreau să văd cine a scris fiecare linie din cod!
```bash
git blame fisier.txt
```

### Am dat push din greșeală!
```bash
git revert <commit-hash>
git push
```
**NU folosi `git push --force` decât dacă ești 100% sigur!**

## 📌 .gitignore

Creează un fișier `.gitignore` pentru a ignora anumite fișiere:
```
# Fișiere pe care Git să le ignore
node_modules/
*.log
.env
.DS_Store
dist/
```

## 💡 Sfaturi

1. **Commit des** - Mai bine 10 commit-uri mici decât unul mare
2. **Mesaje clare** - "Fix bug" e prost, "Rezolvat eroarea de login când parola e goală" e bun
3. **Pull înainte de push** - Evită conflictele
4. **Branch-uri pentru features** - Nu lucra direct pe `main`
5. **Nu face commit cu parole** - Folosește `.gitignore`!

## 🎓 Workflow Tipic

```bash
# 1. Clonezi proiectul
git clone <url>

# 2. Creezi o ramură nouă pentru feature
git checkout -b feature-nou

# 3. Lucrezi și salvezi des
git add .
git commit -m "Am adăugat X"

# 4. Înainte să trimiți, sincronizezi
git checkout main
git pull
git checkout feature-nou
git merge main

# 5. Trimiți pe server
git push origin feature-nou

# 6. Faci Pull Request pe GitHub/GitLab
# 7. După ce e acceptat, ștergi ramura
git branch -d feature-nou
```

---

**Happy coding! 🚀** Dacă ceva e neclar, întreabă-mă!
