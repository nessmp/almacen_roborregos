import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from '../firebase_config'
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class LogDialog extends Component {
  handleClickOpen = () => {
    this.setState({ open: true, display_failed_message: "none" });
  };

  handleClose() {
    this.setState({ open: false });
  };

  handleEmailFieldChange(event) {
    this.setState({
        email: event.target.value
    });
  };

  handlePasswordFieldChange(event) {
    this.setState({
        password: event.target.value
    });
  };

  login(event) {
    const email = this.state.email;
    const password = this.state.password;

    firebase.auth().signInWithEmailAndPassword(
      email, password).then(() => {
      this.handleClose();
    }).catch((error) => {
      this.setState({ display_failed_message: 'block'});
    });
  }

  logout() {
    firebase.auth().signOut().then(() => {
      // TODO: Handle everything fine
    }).catch(function(error) {
      // TODO: handle the error
    });
  }

  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: '',
      open: false,
      display_failed_message: 'none'
    };

    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleEmailFieldChange = this.handleEmailFieldChange.bind(this);
    this.handlePasswordFieldChange = this.handlePasswordFieldChange.bind(this);
  }

  render() {
    return (
      <div>
        <Button
          style=
          {this.props.logedin ? {display: 'none'} : {display: 'inline'}}
          color="inherit"
          onClick={this.handleClickOpen}
          id="log_in"
        >
          LogIn
        </Button>
        <Button
          style=
          {this.props.logedin ? {display: 'inline'} : {display: 'none'}}
          className="hide" onClick={this.logout}
          color="inherit" id="log_out"
        >
          LogOut
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">LogIn</DialogTitle>
          <DialogContent>
            <p style={{display: this.state.display_failed_message, color:'red'}}> Incorrect email or password </p>
            <TextField
              autoFocus
              margin="dense"
              label="E-mail"
              type="email"
              fullWidth
              onChange={this.handleEmailFieldChange}
            />
            <TextField
              margin="dense"
              label="Contraseña"
              type="password"
              fullWidth
              onChange={this.handlePasswordFieldChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.login} color="primary">
              LogIn
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default LogDialog
