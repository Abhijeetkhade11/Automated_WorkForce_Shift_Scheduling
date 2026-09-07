# Week 7: Jenkins Installation and Continuous Integration (CI) Job

Continuous Integration (CI) is the DevOps practice of automating build packaging and verification testing every time code is committed to a repository. This document guides you through running Jenkins, configuring a local SCM Freestyle build job, and archiving the compiled Spring Boot executable JAR.

---

## 1. Starting Jenkins Standalone Server

Jenkins runs locally as a standalone Java server on port `8081`:

1. Open PowerShell and navigate to the project directory:
   ```powershell
   cd d:\Sem7\Devops_proj\WorkForce_Scheduling_Final\worforce_scheduling
   ```
2. Launch the Jenkins WAR archive:
   ```powershell
   java -jar ci/jenkins.war --httpPort=8081
   ```
3. Wait for the terminal to print:
   `Jenkins is fully up and running`

---

## 2. Unlocking and Initializing Jenkins

1. Open your web browser and navigate to: **`http://localhost:8081`**
2. **Unlock Jenkins:** Copy the initial administrator password from the path displayed on the screen (or from your PowerShell console output). Typically found in:
   `C:\Users\<Your-Username>\.jenkins\secrets\initialAdminPassword`
3. Paste the password and click **Continue**.
4. Select **Install suggested plugins** and wait for the installer to download default packages (Git, Pipeline, etc.).
5. Create your **First Admin User** credentials and click **Save and Finish**.

---

## 3. Creating the Freestyle CI Job

Follow these steps to create the automated build job:

1. On the Jenkins dashboard, click **New Item**.
2. Enter the name: `workforce-shift-scheduling-ci`
3. Select **Freestyle project** and click **OK**.

### A. Source Code Management (SCM)
To avoid credential setup delays, configure Jenkins to pull directly from your local filesystem repository:
1. Select **Git**.
2. **Repository URL:** Enter the absolute file path to your project folder:
   `file:///D:/Sem7/Devops_proj/WorkForce_Scheduling_Final/worforce_scheduling`
3. **Branch Specifier:** Change it to: `*/main` (or `*/dev`).

### B. Build Triggers
Configure Jenkins to poll SCM automatically for changes:
1. Check **Poll SCM**.
2. **Schedule:** Enter:
   ```
   * * * * *
   ```
   *(This syntax instructs Jenkins to poll the local folder for new git commits every single minute).*

### C. Build Steps
1. Scroll down to **Build Steps** and click **Add build step**.
2. Select **Execute Windows batch command**.
3. **Command:** Enter:
   ```batch
   mvnw.cmd clean package -DskipTests
   ```
   *(Note: `-DskipTests` is used initially for rapid compiler check. In later test pipelines, tests will be fully enabled).*

### D. Post-Build Actions
Configure Jenkins to save the compiled JAR file:
1. Click **Add post-build action**.
2. Select **Archive the artifacts**.
3. **Files to archive:** Enter:
   ```
   target/*.jar
   ```
4. Click **Save**.

---

## 4. Triggering and Verifying the Build

To test the CI pipeline:

1. Click **Build Now** in the left sidebar of the Jenkins project dashboard to start a manual compile.
2. Under **Build History**, click the running build number (e.g., `#1`) -> **Console Output**.
3. Verify that the output streams log:
   `[INFO] BUILD SUCCESS`
   `Finished: SUCCESS`
4. Go back to the job dashboard. You will see **Last Successful Artifacts** displaying `scheduling-0.0.1-SNAPSHOT.jar` (which you can download directly from the Jenkins dashboard).
