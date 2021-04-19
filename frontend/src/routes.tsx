import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';
import MyTasks from './pages/my-tasks/my-tasks';

function Routes() {
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={MyTasks} />
        <Route path="/dashboard" component={Dashboard}/>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;