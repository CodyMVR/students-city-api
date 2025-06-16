import React, { useEffect, useState, createContext, useContext, PropsWithChildren } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  IonApp,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  home as homeIcon,
  map as mapIcon,
  people as usersIcon,
  logIn as loginIcon,
  personAdd as registerIcon
} from 'ionicons/icons';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

import Home from './pages/Home';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import PlacesPage from './pages/PLacesPage';
import AddPlacePage from './pages/AddPlacePage';
import AdminUsersPage from './pages/AdminUserPage';
import AdminPlacesPage from './pages/AdminPlacesPage';

import { initStorage, getToken, removeToken } from './services/auth';
import Splash from './components/Splash';

interface JwtPayload { roles?: string[]; }
interface AuthContextProps { loggedIn: boolean; isAdmin: boolean; logout: () => void; }

const AuthContext = createContext<AuthContextProps>({ loggedIn: false, isAdmin: false, logout: () => {} });
export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await initStorage();
      const token = await getToken();
      setLoggedIn(!!token);
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          setIsAdmin(!!decoded.roles?.includes('ROLE_ADMIN'));
        } catch {
          setIsAdmin(false);
        }
      }
    })();
  }, []);

  const logout = async () => {
    await removeToken();
    setLoggedIn(false);
    setIsAdmin(false);
  };

  if (loggedIn === null) return null;

  return (
    <AuthContext.Provider value={{ loggedIn, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const AppRouter: React.FC = () => {
  const { loggedIn, isAdmin } = useAuth();

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Switch>
            {/* Public */}
            <Route path="/login" exact>
              {loggedIn ? <Redirect to="/places" /> : <Login />}
            </Route>
            <Route path="/register" exact>
              {loggedIn ? <Redirect to="/places" /> : <RegisterPage />}
            </Route>

            {/* Add Place Form */}
            <Route path="/places/add" exact>
              {loggedIn ? <AddPlacePage /> : <Redirect to="/login" />}
            </Route>

            {/* Protected */}
            <Route path="/home" exact>
              {loggedIn ? <Home /> : <Redirect to="/login" />}
            </Route>
            <Route path="/places" exact>
              {loggedIn ? <PlacesPage /> : <Redirect to="/login" />}
            </Route>
            <Route path="/admin-users" exact>
              {!loggedIn
                ? <Redirect to="/login" />
                : !isAdmin
                  ? <Redirect to="/places" />
                  : <AdminUsersPage />
              }
            </Route>
            <Route path="/admin-places" exact>
              {!loggedIn
                ? <Redirect to="/login" />
                : !isAdmin
                  ? <Redirect to="/places" />
                  : <AdminPlacesPage />
              }
            </Route>

            {/* Default */}
            <Route exact path="/">
              <Redirect to={loggedIn ? "/places" : "/login"} />
            </Route>
            <Route path="*">
              <Redirect to={loggedIn ? "/places" : "/login"} />
            </Route>
          </Switch>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          {loggedIn ? (
            <>
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={homeIcon} />
                <IonLabel>Accueil</IonLabel>
              </IonTabButton>
              <IonTabButton tab="places" href="/places">
                <IonIcon icon={mapIcon} />
                <IonLabel>Vos lieux</IonLabel>
              </IonTabButton>
              {isAdmin && (
                <>
                  <IonTabButton tab="admin-users" href="/admin-users">
                    <IonIcon icon={usersIcon} />
                    <IonLabel>Utilisateurs</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="admin-places" href="/admin-places">
                    <IonIcon icon={mapIcon} />
                    <IonLabel>Validation Lieux</IonLabel>
                  </IonTabButton>
                </>
              )}
            </>
          ) : (
            <>
              <IonTabButton tab="login" href="/login">
                <IonIcon icon={loginIcon} />
                <IonLabel>Connexion</IonLabel>
              </IonTabButton>
              <IonTabButton tab="register" href="/register">
                <IonIcon icon={registerIcon} />
                <IonLabel>Inscription</IonLabel>
              </IonTabButton>
            </>
          )}
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

setupIonicReact();

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <Splash duration={2000} onFinish={handleSplashFinish} />;
  }

  return (
    <IonApp>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </IonApp>
  );
};

export default App;
