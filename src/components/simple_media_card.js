import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import FormDialog from './form_dialog';
import Hidden from '@material-ui/core/Hidden';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveDialog from './remove_dialog';
import ReturnDialog from './return_dialog';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import "./styles.css"

const styles = {
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
};

function importAll(r) {
  let images = {};
  r.keys().forEach(function (item, index) { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

class SimpleMediaCard extends React.Component  {
  render() {
    const { classes } = this.props
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
    } else {
      Buttons =
        <Hidden>
          <Button
            disabled={true} size="small" color="primary"
            className="button"
          >
            Codigo ejemplo
          </Button>
          <FormDialog
            disp={this.props.availables}
            sensor={this.props.img}
            cart={this.props.cart}
            tab={this.props.tab}
          />
        </Hidden>
    }
    var message
    if (this.props.showSelArt)
      message = "Numero de articulos seleccionados: "
    else if (this.props.showReturn) {
      message = "Numero de articulos que tienes: "
    } else {
      message ="Articulos disponibles: "
    }
    return (
      <div>
        <Card className="card">
          <CardMedia
            className={classes.media}
            image={images[this.props.img + ".jpg"]}
            title="Ultrasonico"
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

export default withStyles(styles)(SimpleMediaCard);
