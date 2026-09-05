# Database Setup Guide

This covers the local installation and configuration of PostgreSQL for the project.

## 1. Install PostgreSQL
1. Download the latest version of PostgreSQL for your operating system from [EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Run the installer. You can skip the Stack Builder portion and use the default settings for the rest of the installation. **Remember the password you set for the default `postgres` user.**

## 2. Verify and Configure PATH (Windows)
Ensure `psql` is available in your terminal by running:
`psql --version`

If you receive an error, you must add PostgreSQL to your system's PATH:
1. Find your PostgreSQL `bin` folder path (e.g., `C:\Program Files\PostgreSQL\16\bin`).
2. Open Windows search and type "Edit the system environment variables".
3. Click **Environment Variables...** at the bottom.
4. Under *System variables* or *User variables*, select the **Path** variable and click **Edit...**.
5. Click **New**, paste your `bin` folder path, and click **OK** on all windows to save.

## 3. Project Installation
Since this is a monorepo, install all dependencies from the **root** directory:
```bash
npm install
```

## 4. Environment Variables
Navigate to the `server/` directory, copy the example environment file, and rename it to `.env`:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file to include your database credentials. Replace `johndoe` with your PostgreSQL username (usually `postgres`) and `randompassword` with your actual password. Make sure the database name is set to `mydb`:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/mydb?schema=public"
TEST_DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/test_mydb?schema=public"
```

## 5. Create the Database
1. Open the **SQL Shell (psql)** from your Start menu.
2. Press **Enter** 4 times to accept the default Server, Database, Port, and Username.
3. Enter your PostgreSQL password.
4. Run the following command to create your local database (must match your `.env` URL):

```sql
CREATE DATABASE mydb;
```

5. Type `\q` and press Enter to exit.

## 6. Prisma Setup
Navigate back to the **root** folder (`BuyBuyIn/`) and run the predefined workspace scripts to generate the client and apply your database tables:

```bash
npm run gen:prisma
npm run mig:prisma
```

## 7. Seed Data (Optional)
To manually inspect your database or add dummy user data, open Prisma Studio from the root folder:

```bash
npm run studio:prisma
```
This will open a browser tab where you can click on the `user` table, click **Add Record**, fill in the required fields, and save changes.

## 8. Run and Verify
Start both the frontend and backend servers simultaneously from the **root** folder:

```bash
npm run dev
```

* **Frontend:** Open `http://localhost:5173` in your browser.
* **Backend API Test:** Open `http://localhost:3000/api/v1/auth/protected` in your browser. If your setup is correct,