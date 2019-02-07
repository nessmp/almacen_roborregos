import Button from '@material-ui/core/Button';
import CustomTable from './custom_table';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { Component } from 'react';

var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

class ReserveDialog extends Component {

  handleClose() {
    this.setState({ open: false });
  };

  async handleApartarClick() {
    this.setState({ open: true});
    var user = firebase.auth().currentUser
    var db = firebase.database();
    var ref = db.ref("prestados");
    let email = user.email.split('@')
    let name = email[0] + " " + email[1].replace('.com', '')
    await ref.once('value').then((snapshot) => {
      if (!snapshot.hasChild(name)) {
        ref.child(name).set({
          nada: 0,
        });
      }
    });
    let postsRef = ref.child(name);
    for (let keyArt in this.props.articulos) {
      let refDisp = firebase.database().ref(
        this.props.articulos[keyArt][1] + "/" + keyArt);
      let numDisp;
      await refDisp.once('value').then((num) => {
        numDisp = num.val()
      });
      if (numDisp >= this.props.articulos[keyArt][0]) {
        await postsRef.once('value').then((snapshot) => {
          let numOfWantedSensors = this.props.articulos[keyArt][0]
          if (snapshot.val()[keyArt]) {
            let art = this.props.articulos;
            art[keyArt] = [parseInt(art[keyArt], 10) +
              parseInt(snapshot.val()[keyArt], 10), art[keyArt][1]]
            this.setState({ articulos: art })
          }
          postsRef.update({
            [keyArt]: parseInt(this.props.articulos[keyArt][0], 10),
          });
          refDisp = firebase.database().ref(
            this.props.articulos[keyArt][1] + "/");
          refDisp.update({
            [keyArt]: parseInt(numDisp, 10) - numOfWantedSensors,
          });
          delete this.props.articulos[keyArt]
        });
      }
    }
    ref.once('value').then((snapshot) => {
      let dict =  snapshot.val()[name]
      delete dict.nada
      ref.child(name).set(dict);
    });
    this.props.selArt()
  }

  constructor(props){
    super(props);

    this.state = {
      open: false
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleApartarClick = this.handleApartarClick.bind(this);
  }

  render() {
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleApartarClick}
          id="apartar"
        >
          Apartar
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Materiales apartados</DialogTitle>
          <DialogContent>
            <p>
              Gracias por usar el sistema del almacen, 
              los siguientes articulos han sido apartados exitosamente
            </p>
            <CustomTable
              list={this.props.articulos}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ReserveDialog
