// routing
import Routes from 'routes';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import Snackbar from 'ui-component/extended/Snackbar';

// auth provider
import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';

// ==============================|| APP ||============================== //

const App = () => (
    <Locales>
        <NavigationScroll>
            <AuthProvider>
                <Routes />
                <Snackbar />
            </AuthProvider>
        </NavigationScroll>
    </Locales>
);

export default App;
