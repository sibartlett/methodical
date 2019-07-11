import React, { useEffect, useState } from "react";
import { useActions, useStore } from "easy-peasy";
import { Link, Switch, Route, Redirect, withRouter } from "react-router-dom";

import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import NotesIcon from "@material-ui/icons/Notes";
import Settingscon from "@material-ui/icons/Settings";

import { makeStyles } from "@material-ui/styles";

import DocumentEditor from "./DocumentEditor";
import DocumentList from "./DocumentList";
import SchemaEditor from "./SchemaEditor";
import SchemaList from "./SchemaList";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  }
}));

const mapState = ({
  schemas: {
    items: { items: schemas = [] },
    hasLoaded,
    isLoading
  }
}) => ({
  hasLoaded,
  isLoading,
  schemas
});

const mapActions = ({ schemas: { find: fetchSchemas } }) => ({
  fetchSchemas
});

const Root = () => {
  const classes = useStyles();
  const {
    hasLoaded,
    isLoading,
    schemas
  } = useStore(mapState);
  const { fetchSchemas } = useActions(mapActions);

  useEffect(() => {
    if (!hasLoaded && !isLoading) {
      fetchSchemas();
    }
  }, []);

  const [open, setOpen] = useState(true);

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper
        }}
        variant="permanent"
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItem button onClick={() => setOpen(!open)}>
            <ListItemIcon>
              <NotesIcon />
            </ListItemIcon>
            <ListItemText primary={"Documents"} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {schemas.map(schema => (
                <ListItem
                  key={schema._id}
                  button
                  className={classes.nested}
                  component={Link}
                  to={`/documents/${schema._id}`}
                >
                  <ListItemText inset primary={schema.title} />
                </ListItem>
              ))}
            </List>
          </Collapse>
          <ListItem button component={Link} to={"/schemas"}>
            <ListItemIcon>
              <Settingscon />
            </ListItemIcon>
            <ListItemText primary={"Schemas"} />
          </ListItem>
        </List>
      </Drawer>
      <div className={classes.content}>
        <Switch>
          <Route path="/documents/:schemaId" exact component={DocumentList} />
          <Route path="/documents/:schemaId/:documentId" exact component={DocumentEditor} />
          <Route path="/schema/:schemaId" exact component={SchemaEditor} />
          <Route path="/schemas" exact component={SchemaList} />
          <Redirect exact from="/" to="/schemas" />
        </Switch>
      </div>
    </div>
  );
};

export default withRouter(Root);
