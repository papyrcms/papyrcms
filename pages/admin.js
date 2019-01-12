import react, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { setSettings } from '../store';
import axios from 'axios';

class AdminPage extends Component {

  static async getInitialProps( context ) {

    return { users: context.query.users };
  }

  
  constructor( props ) {

    super( props );

    this.state = props.settings;
  }


  handleSubmit( event ) {

    event.preventDefault();

    axios.post( '/admin/settings', this.state )
      .then( response => {
        if ( !!response.data._id ) {
          this.props.setSettings( response.data );
        }
      }).catch( error => {
        console.log(error);
      });
  }


  renderUsers() {
    const { users } = this.props;

    return _.map( users, user => {
      return (
        <li key={ user._id }>
          { user.email }
        </li>
      );
    });
  }


  render() {

    const { 
      enableMenu,
      enableCommenting, 
      enableEmailing,
      enableUserPosts
    } = this.state;

    return (
      <div className="admin-page">
        <form onSubmit={ event => this.handleSubmit( event ) }>
          <label htmlFor="enable-emailing">Enable Emailing</label>
          <input
            type="checkbox"
            id="enable-emailing"
            checked={ enableEmailing ? true : false }
            onChange={ () => this.setState({ enableEmailing: !enableEmailing }) }
          />

          <label htmlFor="enable-menu">Enable Menu</label>
          <input
            type="checkbox"
            id="enable-menu"
            checked={ enableMenu ? true : false }
            onChange={ () => this.setState({ enableMenu: !enableMenu }) }
          />

          <label htmlFor="enable-commenting">Enable Commenting</label>
          <input
            type="checkbox"
            id="enable-commenting"
            checked={ enableCommenting ? true : false }
            onChange={ () => this.setState({ enableCommenting: !enableCommenting }) }
          />

          <label htmlFor="enable-user-posts">Enable User Posting</label>
          <input
            type="checkbox"
            id="enable-user-posts"
            checked={ enableUserPosts ? true : false }
            onChange={ () => this.setState({ enableUserPosts }) }
          />

          <input type="submit" className="button button-primary" />
        </form>

        <ul>
          { this.renderUsers() }
        </ul>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return { settings: state.settings, users: state.users };
}


export default connect( mapStateToProps, { setSettings } )( AdminPage );
