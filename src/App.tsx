import "./App.css";

import Header from "./containers/Header";
import Content from "./containers/Content";
import ShaderBackground from "./components/ShaderBackground";

function App() {
    return (
        <div className="app-shell">
            <ShaderBackground />
            <Header />
            <Content />
        </div>
    );
}

export default App;
