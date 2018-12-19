/*
  1-SearchBox
  2-Mostrar quien tiene que
*/
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import classNames from 'classnames';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import FullWidthGrid from './full_width_grid.js'
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LogDialog from './log_dialog';
import MaterialIcon from 'material-icons-react';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React from 'react';
import SimpleMediaCard from './simple_media_card.js'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import './constFile.js'

var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  login: {
    marginRight: '2%',
  },
  input: {
    margin: theme.spacing.unit,
  },
  appFrame: {
    height: 'auto',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
});

class PersistentDrawer extends React.Component {
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value,
    });
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          message: "Bienvenido " + user.email,
          userLogedin: true
         })
      } else {
        this.setState({
          message: "Inicia sesión para utilizar el sistema de almacen.",
          userLogedin: false
         })
      }
    });
  }

  handleTabClick(tab) {
    this.setState({
       tabSelection: tab,
       showSelectedArticles: false
     });
    const simpleCardsArray = [];
    if (tab === "todos") {
      let ref = firebase.database().ref("/");
      ref.once('value').then((snapshot) => {
        Object.keys(snapshot.val()).forEach((element) => {
          if (element !== "prestados") {
            ref = firebase.database().ref(element + "/");
            ref.once('value').then((snapshot2) => {
              Object.keys(snapshot2.val()).forEach((data) => {
                simpleCardsArray.push(
                  <SimpleMediaCard
                    img={data}
                    availables={snapshot2.val()[data]}
                    change={this.state.change}
                    cart={this.addToCart}
                    showSelArt={this.state.showSelectedArticles}
                    tab={element}
                  />);
              });
              const GridOfSimpleCards = simpleCardsArray.map((card) => {
                return (
                  <Grid item xs={6} sm={3}>
                    {card}
                  </Grid>
                )
              });
              this.setState({ GridOfSimpleCardsArray: GridOfSimpleCards });
            });
          }
        });
      });
    } else {
      let ref = firebase.database().ref(tab + "/");
      ref.once('value').then((snapshot) => {
        Object.keys(snapshot.val()).forEach((element) => {
          simpleCardsArray.push(
            <SimpleMediaCard
              img={element}
              availables={snapshot.val()[element]}
              cart={this.addToCart}
              showSelArt={this.state.showSelectedArticles}
              tab={this.state.tabSelection}
            />);
        });
        const GridOfSimpleCards = simpleCardsArray.map((card) => {
          return (
            <Grid item xs={6} sm={3}>
              {card}
            </Grid>
          )
        });
        this.setState({ GridOfSimpleCardsArray: GridOfSimpleCards });
      });
    }
  }

  addToCart(art, cant, tab) {
    var newArticles = this.state.articulos;
    newArticles = {...newArticles,
      [art]:  [cant, tab]
    }

    this.setState({ articulos: newArticles });
  }

  removeFromCart(art, cant) {
    var newArticles = this.state.articulos;
    newArticles[art][0] = newArticles[art][0] - cant
    if (newArticles[art][0] <= 0) {
      delete newArticles[art]
    }
    this.setState({ articulos: newArticles });
    this.handleSelectArticlesClick()
  }

  handleSelectArticlesClick(){
    const simpleCardsArray = [];
    for(var key in this.state.articulos) {
      simpleCardsArray.push(
        <SimpleMediaCard
          img={key}
          availables={this.state.articulos[key][0]}
          cart={this.removeFromCart}
          showSelArt={true}
          tab={this.state.tabSelection}
        />);
    }
    const GridOfSimpleCards = simpleCardsArray.map((card) => {
      return (
        <Grid item xs={6} sm={3}>
          {card}
        </Grid>
      )
    });
    this.setState({
      GridOfSimpleCardsArray: GridOfSimpleCards,
      showSelectedArticles: true
     });
  }

  async handleApartarClick() {
    var user = firebase.auth().currentUser
    var db = firebase.database();
    var ref = db.ref("prestados");
    await ref.once('value').then((snapshot) => {
      if (!snapshot.hasChild(user.uid)) {
        ref.child(user.uid).set({
          nada: 0,
        });
      }
    });
    let postsRef = ref.child(user.uid);
    for (let keyArt in this.state.articulos) {
      let refDisp = firebase.database().ref(
        this.state.articulos[keyArt][1] + "/" + keyArt);
      let numDisp;
      await refDisp.once('value').then((num) => {
        numDisp = num.val()
      });
      if (numDisp >= this.state.articulos[keyArt][0]) {
        await postsRef.once('value').then((snapshot) => {
          let numOfWantedSensors = this.state.articulos[keyArt][0]
          if (snapshot.val()[keyArt]) {
            let art = this.state.articulos;
            art[keyArt] = [parseInt(art[keyArt], 10) +
              parseInt(snapshot.val()[keyArt], 10), art[keyArt][1]]
            this.setState({ articulos: art })
          }
          postsRef.update({
            [keyArt]: parseInt(this.state.articulos[keyArt][0], 10),
          });
          refDisp = firebase.database().ref(
            this.state.articulos[keyArt][1] + "/");
          refDisp.update({
            [keyArt]: parseInt(numDisp, 10) - numOfWantedSensors,
          });
          delete this.state.articulos[keyArt]
        });
      }
    }
    this.handleSelectArticlesClick()
  }

  async handleRegresarClick() {
    var user = firebase.auth().currentUser
    var ref = firebase.database().ref("prestados/" + user.uid);
    var articles = []
    await ref.once('value').then((snapshot) => {
      articles.push(snapshot.val());
    });
    const simpleCardsArray = [];
    for (let article in articles[0]) {
      if (article !== "nada" && articles[0][article] > 0) {
        simpleCardsArray.push(
          <SimpleMediaCard
                img={article}
                availables={articles[0][article]}
                showSelArt={false}
                showReturn={true}
                updateCards={this.handleRegresarClick}
          />
        );
      }
    }
    const GridOfSimpleCards = simpleCardsArray.map((card) => {
      return (
        <Grid item xs={6} sm={3}>
          {card}
        </Grid>
      )
    });
    this.setState({
      GridOfSimpleCardsArray: GridOfSimpleCards,
      showSelectedArticles: false
     });
  }

  handleBuscarClick() {
    let ref = firebase.database().ref("prestados/");
      ref.once('value').then((snapshot) => {
        let lent_articles = {};
        Object.entries(snapshot.val()).forEach(
          ([name, value]) => {
            Object.entries(value).forEach(
              ([sensor, cant]) => {
                if (cant !== 0) {
                  if (lent_articles.hasOwnProperty(name)) {
                    lent_articles[sensor][name] = cant
                  } else {
                    lent_articles[sensor] = {}
                    lent_articles[sensor][name] = cant
                  }
                }
              }
            );
          }
        );
        const simpleCardsArray = []
        Object.keys(lent_articles).forEach((element) => {
          simpleCardsArray.push(
            <SimpleMediaCard
              img={element}
              list={lent_articles[element]}
              showList={true}
            />);
        });
        const GridOfSimpleCards = simpleCardsArray.map((card) => {
          return (
            <Grid item xs={6} sm={3}>
              {card}
            </Grid>
          )
        });
        this.setState({ GridOfSimpleCardsArray: GridOfSimpleCards });
      });
  }

  constructor(props){
    super(props);

    this.state = {
      message: "Inicia sesión para utilizar el sistema de almacen.",
      userLogedin: false,
      open: false,
      anchor: 'left',
      tabSelection: "todos",
      GridOfSimpleCardsArray: [],
      change: true,
      articulos: {},
      showSelectedArticles: false
    };

    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleChangeAnchor = this.handleChangeAnchor.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.handleSelectArticlesClick = this.handleSelectArticlesClick.bind(this);
    this.handleApartarClick = this.handleApartarClick.bind(this);
    this.handleRegresarClick = this.handleRegresarClick.bind(this);
    this.handleBuscarClick = this.handleBuscarClick.bind(this);
  }

  render() {
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;
    let addButton;
    if (this.state.showSelectedArticles && this.state.userLogedin) {
      addButton =
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleApartarClick}
        >
          Apartar
        </Button>;
    } else {
      addButton =
        <Hidden xsUp>
        </Hidden>;
    }
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open,
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="title" color="inherit" className={classes.flex}
              >
                {this.state.message}
              </Typography>
              <LogDialog logedin={this.state.userLogedin}/>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="persistent"
            anchor={anchor}
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'rtl' ?
                  <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              <div>
                <ListItem button onClick={() => this.handleTabClick("todos")}>
                  <ListItemIcon>
                    <MaterialIcon icon="view_comfy" />
                  </ListItemIcon>
                  <ListItemText
                     primary="Todos"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("distancia")}>
                  <ListItemIcon>
                    <MaterialIcon icon="straighten" />
                  </ListItemIcon>
                  <ListItemText
                     primary="Distancia"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("motores")}>
                  <ListItemIcon>
                    <MaterialIcon icon="motorcycle" />
                  </ListItemIcon>
                  <ListItemText
                     primary="Motores"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("servo motores")}>
                  <ListItemIcon>
                    <MaterialIcon icon="rotate_right" />
                  </ListItemIcon>
                  <ListItemText
                     primary="Servo Motores"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("temperatura")}>
                  <ListItemIcon>
                  <MaterialIcon icon="ac_unit" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Temperatura"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("micros")}>
                  <ListItemIcon>
                    <MaterialIcon icon="fiber_pin" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Micros"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("mecanica")}>
                  <ListItemIcon>
                    <MaterialIcon icon="edit" />
                  </ListItemIcon>
                  <ListItemText
                     primary="Mecanica"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("camaras")}>
                  <ListItemIcon>
                    <MaterialIcon icon="camera_alt" />
                  </ListItemIcon>
                  <ListItemText
                     primary="Camaras"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("imu")}>
                  <ListItemIcon>
                    <MaterialIcon icon="gps_fixed" />
                  </ListItemIcon>
                  <ListItemText
                     primary="IMU"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("varios")}>
                  <ListItemIcon>
                    <MaterialIcon icon="widgets" />
                  </ListItemIcon>
                  <ListItemText
                     primary="Varios"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("electronica")}>
                  <ListItemIcon>
                    <MaterialIcon icon="battery_charging_full" />
                  </ListItemIcon>
                  <ListItemText
                     primary="Electronica"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("drivers")}>
                  <ListItemIcon>
                    <MaterialIcon icon="power_input" />
                  </ListItemIcon>
                  <ListItemText
                     primary="Drivers"
                   />
                </ListItem>
              </div>
            </List>
            <Divider />
            <List>
              <div>
                <ListItem button onClick={this.handleSelectArticlesClick}>
                  <ListItemIcon>
                    <MaterialIcon icon="shopping_cart" />
                  </ListItemIcon>
                  <ListItemText primary="Articulos Seleccionados" />
                </ListItem>
                <ListItem button onClick={this.handleRegresarClick}>
                  <ListItemIcon>
                    <MaterialIcon icon="inbox" />
                  </ListItemIcon>
                  <ListItemText primary="Regresar articulos" />
                </ListItem>
                <ListItem button onClick={this.handleBuscarClick}>
                  <ListItemIcon>
                    <MaterialIcon icon="inbox" />
                  </ListItemIcon>
                  <ListItemText primary="Buscar Articulo" />
                </ListItem>
              </div>
            </List>
          </Drawer>
          <main
            className={classNames(
              classes.content, classes[`content-${anchor}`], {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open,
            })}
          >
            <div className={classes.drawerHeader} />
            <Typography>
              <FullWidthGrid
                gridCards={!this.state.userLogedin ?
                    <Grid></Grid> : this.state.GridOfSimpleCardsArray}
              />
          </Typography>
          {addButton}
          </main>
        </div>
      </div>
    );
  }
}


PersistentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawer);
