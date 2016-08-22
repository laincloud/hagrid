import React from 'react'
import ReactDOM from 'react-dom'
import NavigateMenu from './components/LeftMenu'
import MainContent from './components/Content'
import {messagePanel} from './components/Common'
import {UserProfileMenu, AddAlertModal} from './components/RightTopMenu'



ReactDOM.render(<NavigateMenu />, document.getElementById('left_menu'));
ReactDOM.render(<UserProfileMenu />, document.getElementById('user_profile'));
ReactDOM.render(<MainContent />, document.getElementById('tab_content'));
