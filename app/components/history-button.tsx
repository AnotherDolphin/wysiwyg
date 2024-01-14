import {
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  Modal,
} from "@mui/material"
import React, { useState, useRef } from "react"
import { History } from "@mui/icons-material"
import { IArticleWithHistory } from "../articles/page"

function HistoryButton({ history, author, createdAt }: IArticleWithHistory) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const id = open ? "history-popover" : undefined

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleOpen}
        // startIcon={<History />}
        className="text-gray-500 px-1 border-none hover:text-gray-700 hover:translate-y-1 transition duration-200 ease-in-out"
        style={{ textTransform: "none" }}
      >
        {/* History */}
        <History />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        className="flex items-center justify-center"
      >
        <div className="bg-white border-2 border-black shadow-lg p-6 max-h-4/5 overflow-y-auto">
          <h2 id="simple-modal-title">Edit Timeline</h2>
          <List>
            {
              // Sort the history by date (newest first)
              history
                .sort((a, b) => {
                  return (
                    new Date(b.updateTime).getTime() -
                    new Date(a.updateTime).getTime()
                  )
                })
                // Map the history to a list of list items
                .map((historyItem) => (
                  <ListItem key={historyItem._id}>
                    <ListItemText
                      primary={"Edited by " + historyItem.userEmail}
                      secondary={new Date(historyItem.updateTime).toLocaleString(
                        "en-GB",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                          hour12: false,
                        }
                      )}
                    />
                  </ListItem>
                ))
            }
            <ListItem>
              <ListItemText
                primary={"Published by " + author}
                secondary={new Date(createdAt).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  hour12: false,
                })}
              />
            </ListItem>
          </List>
        </div>
      </Modal>
    </div>
  )
}

export default HistoryButton
