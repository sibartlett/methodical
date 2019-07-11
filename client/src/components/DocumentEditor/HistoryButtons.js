import React from "react";
import { useActions, useStore } from "easy-peasy";

import IconButton from "@material-ui/core/IconButton";
import RedoIcon from "@material-ui/icons/Redo";
import UndoIcon from "@material-ui/icons/Undo";

const mapState = ({
  documents: {
    item: { future, history }
  }
}) => ({
  future,
  history
});

const mapActions = ({ documents: { redoChange, undoChange } }) => ({
  redoChange,
  undoChange
});

const HistoryButtons = () => {
  const { future, history } = useStore(mapState);
  const { redoChange, undoChange } = useActions(mapActions);

  return (
    <>
      <IconButton
        color="inherit"
        disabled={!history.length}
        onClick={() => undoChange()}
      >
        <UndoIcon />
      </IconButton>
      <IconButton
        color="inherit"
        disabled={!future.length}
        onClick={() => redoChange()}
      >
        <RedoIcon />
      </IconButton>
    </>
  );
};

export default HistoryButtons;
