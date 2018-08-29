import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import TextField from '@material-ui/core/TextField';

var firebase = require('firebase');

export default class ReturnDialog extends React.Component {
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  async handleReturn() {
    if (this.state.value >= 0) {
      var user = firebase.auth().currentUser
      var ref = firebase.database().ref(
        "prestados/" + user.uid)
      var numSensorUserHas = 0
      await ref.once('value').then((num) => {
        numSensorUserHas = num.val()[this.props.sensor]
      });
      var newNumSensorUserHas = numSensorUserHas - this.state.value  < 0 ?
        0 : numSensorUserHas - this.state.value
      ref.update({
        [this.props.sensor]: parseInt(newNumSensorUserHas)
      });

      // TODO: Find a more efficient way to make this.
      var distanciaRef = firebase.database().ref("distancia/")
      distanciaRef.once('value').then((snapshot) => {
        for (let key in snapshot.val()) {
          if (key === this.props.sensor) {
            distanciaRef.update({
              [this.props.sensor]: parseInt(snapshot.val()[this.props.sensor]) +
                parseInt(this.state.value)
            });
          }
        }
      });
      var displaysRef = firebase.database().ref("displays/")
      displaysRef.once('value').then((snapshot) => {
        for (let key in snapshot.val()) {
          if (key === this.props.sensor) {
            distanciaRef.update({
              [this.props.sensor]: parseInt(snapshot.val()[this.props.sensor]) +
                parseInt(this.state.value)
            });
          }
        }
      });
      var motoresRef = firebase.database().ref("motores/")
      motoresRef.once('value').then((snapshot) => {
        for (let key in snapshot.val()) {
          if (key === this.props.sensor) {
            distanciaRef.update({
              [this.props.sensor]: parseInt(snapshot.val()[this.props.sensor]) +
                parseInt(this.state.value)
            });
          }
        }
      });
      var temperaturaRef = firebase.database().ref("temperatura/")
      await temperaturaRef.once('value').then((snapshot) => {
        for (let key in snapshot.val()) {
          if (key === this.props.sensor) {
            distanciaRef.update({
              [this.props.sensor]: parseInt(snapshot.val()[this.props.sensor]) +
                parseInt(this.state.value)
            });
          }
        }
      });
      this.setState({ open: false });
      this.props.updateCards()
    }
  };

  setValue(event) {
    this.setState({ value: event.target.value })
  }

  constructor(props){
    super(props);

    this.state = {
      value: 0,
      open: false
    };

    this.setValue = this.setValue.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
  }

  render() {
    return (
      <div>
        <Button size="small" color="primary" onClick={this.handleClickOpen}>
          Regresar
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Regresar articulo
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Cuantos elementos quieres regresar.
            </DialogContentText>
            <TextField
              onChange={this.setValue}
              autoFocus
              margin="dense"
              label="Cantidad"
              type="number"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.handleReturn} color="primary">
              Regresar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
