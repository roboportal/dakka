import { ChangeEvent } from 'react'
import { css } from '@emotion/react'
import { useDispatch, useSelector } from 'react-redux'

import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddIcon from '@mui/icons-material/Add'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import Tooltip from '@mui/material/Tooltip'
import { red } from '@mui/material/colors'

import useToggle from '@/hooks/useToggle'
import {
  getActiveTestCase,
  getIsFirstEventRecorded,
  getIsReadyToExport,
} from '@/store/eventSelectors'
import {
  addItToTestCase,
  changeDescribe,
  changeIt,
  removeItFromTestCase,
  selectIt,
} from '@/store/eventRecorderSlice'

export default function ProjectPanel() {
  const [isDrawerOpened, toggleIsDrawerOpened] = useToggle(false)

  const dispatch = useDispatch()

  const testCase = useSelector(getActiveTestCase) ?? {}

  const isIncompleteSetup = !useSelector(getIsReadyToExport)
  const isFirstEventRecorded = useSelector(getIsFirstEventRecorded)

  const createIt = () => {
    dispatch(addItToTestCase())
  }

  const handleChangeDescribe = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => dispatch(changeDescribe(e.target.value))

  const isDeleteButtonVisible = testCase?.its?.length > 1

  return (
    <>
      <Drawer
        anchor="left"
        open={isDrawerOpened}
        onClose={toggleIsDrawerOpened}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            margin: 8px;
            width: 40vw;
            min-width: 300px;
          `}
        >
          <IconButton
            css={css`
              align-self: flex-end;
            `}
            color="primary"
            onClick={toggleIsDrawerOpened}
          >
            <CloseIcon />
          </IconButton>
          <div
            css={css`
              width: 100%;
              margin-top: 4px;
            `}
          >
            <TextField
              label="Describe"
              size="small"
              value={testCase.describe}
              css={css`
                width: 100%;
              `}
              onChange={handleChangeDescribe}
            />
          </div>
          <div
            css={css`
              margin-top: 16px;
            `}
          >
            {testCase?.its?.map?.((it) => (
              <div
                key={it.id}
                css={css`
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 8px;
                  width: 100%;
                `}
              >
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    width: 18px;
                  `}
                >
                  {!it.isValidSetup && (
                    <Tooltip title="Unfinished Setup">
                      <WarningAmberIcon
                        fontSize="small"
                        css={css`
                          color: ${red.A200};
                        `}
                      />
                    </Tooltip>
                  )}
                </div>
                <Radio
                  checked={it.selected}
                  onClick={() => {
                    dispatch(selectIt(it.id))
                  }}
                />
                <TextField
                  label="It"
                  size="small"
                  value={it.value}
                  css={css`
                    width: 100%;
                    margin-left: 4px;
                    margin-right: 4px;
                  `}
                  onChange={(e) =>
                    dispatch(changeIt({ id: it.id, value: e.target.value }))
                  }
                />
                {isDeleteButtonVisible && (
                  <IconButton
                    color="error"
                    onClick={() => dispatch(removeItFromTestCase(it.id))}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                )}
              </div>
            ))}
          </div>
          <div
            css={css`
              align-self: center;
            `}
          >
            <IconButton color="primary" size="large" onClick={createIt}>
              <AddIcon />
            </IconButton>
          </div>
        </div>
      </Drawer>
      <IconButton
        css={css`
          border-radius: 4px;
          margin: 0 4px 8px 0;
          padding: 0 4px;
          display: flex;
          flex-direction: column;
          position: relative;
        `}
        color="info"
        onClick={toggleIsDrawerOpened}
      >
        {isIncompleteSetup && isFirstEventRecorded && (
          <Tooltip title="Unfinished Setup">
            <WarningAmberIcon
              fontSize="small"
              css={css`
                color: ${red.A200};
                top: 4px;
                position: absolute;
              `}
            />
          </Tooltip>
        )}
        <ArrowForwardIosIcon />
      </IconButton>
    </>
  )
}
