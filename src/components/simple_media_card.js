import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import AddToCartDialog from './add_to_cart_dialog';
import Hidden from '@material-ui/core/Hidden';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveDialog from './remove_dialog';
import ReturnDialog from './return_dialog';
import ListDialog from './list_dialog';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Styles from './styles.js'

function importAllImages(r) {
  let images = {};
  r.keys().forEach(function (item) { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAllImages(require.context('./images', false, /\.(png|jpe?g|svg)$/));

class SimpleMediaCard extends React.Component  {
  render() {
    const { classes } = this.props
    // The buttons on the card will change depending on what the user want to do
    let Buttons;
    if (this.props.showSelArt) {
      Buttons =
        <RemoveDialog
          sensor={this.props.img}
          cart={this.props.cart}
        />
    } else if(this.props.showReturn) {
      Buttons =
        <ReturnDialog
          sensor={this.props.img}
          updateCards={this.props.updateCards}
        />
    } else if (this.props.showList) {
      Buttons =
      <ListDialog
        list={this.props.list}
      />
    } else {
      Buttons =
        <Hidden>
          <Button
            disabled={true} size="small" color="primary"
            className="button"
          >
            Codigo ejemplo
          </Button>
          <AddToCartDialog
            disp={this.props.availables}
            sensor={this.props.img}
            cart={this.props.cart}
            tab={this.props.tab}
          />
        </Hidden>
    }

    // The text on the card will change depending on what the user want to do
    var message
    if (this.props.showSelArt)
      message = "Numero de articulos seleccionados: "
    else if (this.props.showReturn) {
      message = "Numero de articulos que tienes: "
    } else if (this.props.showList) {
      message = ""
    } else {
      message ="Articulos disponibles: "
    }

    return (
      <div>
        <Card className="card">
          <CardMedia
            className={classes.media}
            image={images[this.props.img + ".jpg"]}
            title={this.props.img}
          />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              {this.props.img}
            </Typography>
            <Typography component="p">
              {message} {this.props.availables}
            </Typography>
          </CardContent>
          <CardActions>
            {Buttons}
          </CardActions>
        </Card>
      </div>
    );
  }
}

SimpleMediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(Styles)(SimpleMediaCard);
