/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Login from './screens/Login';
import {name as appName} from './app.json';

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => Login);
