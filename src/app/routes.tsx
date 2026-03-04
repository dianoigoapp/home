import { OnboardingPage } from "../pages/OnboardingPage";
import { Route, Switch } from "wouter";
import { AppShell } from "./shell/AppShell";
import { CoursesPage } from "../pages/CoursesPage";
import { LibraryPage } from "../pages/LibraryPage";
import { CoursePage } from "../pages/CoursePage";
import { ModulePage } from "../pages/ModulePage";
import { LessonPage } from "../pages/LessonPage";
import { RedeemCodePage } from "../pages/RedeemCodePage";
import { SplashPage } from "../pages/SplashPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterTypePage } from "../pages/auth/RegisterTypePage";
import { RegisterIndividualPage } from "../pages/auth/RegisterIndividualPage";
import { RegisterInstitutionPage } from "../pages/auth/RegisterInstitutionPage";
import { PastoralDashboardPage } from "../pages/pastoral/PastoralDashboardPage";
import { PastoralLicensesPage } from "../pages/pastoral/PastoralLicensesPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { AuthGuard, InstitutionGuard } from "../auth/guards";

export function Router() {
  return (
    <Switch>
      <Route path="/splash" component={SplashPage} />

      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register/type" component={RegisterTypePage} />
      <Route path="/auth/register/individual" component={RegisterIndividualPage} />
      <Route path="/auth/register/institution" component={RegisterInstitutionPage} />

      <Route>
        <AuthGuard>
          <AppShell>
            <Switch>
              <Route path="/" component={CoursesPage} />
              <Route path="/courses" component={CoursesPage} />
              <Route path="/library" component={LibraryPage} />
              <Route path="/redeem" component={RedeemCodePage} />
              <Route path="/course/:courseId" component={CoursePage} />
              <Route path="/course/:courseId/module/:moduleId" component={ModulePage} />
              <Route path="/course/:courseId/lesson/:lessonId" component={LessonPage} />

              <Route path="/pastoral/dashboard">
                <InstitutionGuard>
                  <PastoralDashboardPage />
                </InstitutionGuard>
              </Route>

              <Route path="/pastoral/licenses">
                <InstitutionGuard>
                  <PastoralLicensesPage />
                </InstitutionGuard>
              </Route>

              <Route component={NotFoundPage} />
            </Switch>
          </AppShell>
        </AuthGuard>
      </Route>
    </Switch>
  );
}
