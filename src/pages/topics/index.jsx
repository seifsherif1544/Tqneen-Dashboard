import React, { useCallback } from 'react'
import { useRouter } from 'next/router'

// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { Button, Divider, MenuItem, Select, Switch } from '@mui/material'

import axios from 'axios'

// import EditArea from './editarea'
// import AddArea from './addarea'
// import { fetchData } from 'src/store/apps/user'
import baseUrl from 'src/API/apiConfig'
import AddTopics from './addtopic'
import EditTopic from './editTopic'
import toast from 'react-hot-toast'
import CustomDelete from 'src/@core/components/customDelete'
import DeleteData from 'src/@core/components/topics/DeleteData'
import CustomTextField from 'src/@core/components/mui/text-field'
import { convertJsonToExcel } from 'src/@core/utils/convertToExcelFile'

// ** Styled Components

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

const defaultColumns = [
  {
    flex: 0.2,
    field: 'id',
    minWidth: 100,
    headerClassName: 'super-app-theme--header',
    headerName: 'ID',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'ID'}
      </Typography>
    ),
    renderCell: ({ row }) => <Typography sx={{ color: '#000' }}>{`#${row?.id}`}</Typography>
  },

  {
    flex: 0.2,
    minWidth: 100,
    headerClassName: 'super-app-theme--header',
    field: 'en',
    headerName: 'Topics en',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'Topics En'}
      </Typography>
    ),
    renderCell: ({ row }) => <Typography sx={{ color: '#000', textWrap: 'wrap' }}>{row?.name?.en}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'ar',
    headerClassName: 'super-app-theme--header',
    headerName: 'Topics ar',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'Topics Ar'}
      </Typography>
    ),
    renderCell: ({ row }) => <Typography sx={{ color: '#000', textWrap: 'wrap' }}>{row?.name?.ar}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'specialization',
    headerClassName: 'super-app-theme--header',
    headerName: 'specialization',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'Specialization'}
      </Typography>
    ),
    renderCell: ({ row }) => (
      <Typography sx={{ color: '#000' }}>{row?.specialization?.name?.ar || 'No Data'}</Typography>
    )
  }
]
const label = { inputProps: { 'aria-label': 'Color switch demo' } }

/* eslint-enable */
const Topics = () => {
  // ** State
  const [data, setDates] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editTopicId, setEditTopicId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [topicDeleteId, setTopicDeleteId] = useState('')
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [totalCounts, setTotalCounts] = useState('')
  const { page, pageSize } = paginationModel

  // Handle Edit dialog
  const handleAddClickOpen = () => setOpenAdd(true)
  const handleEditClickOpen = () => setOpenEdit(true)

  const router = useRouter()

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/api/topics?page=${page + 1}&limit=${pageSize}&search=${value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = response.data
      setDates(data?.data?.docs)
      setTotalCounts(data?.data?.totalDocs)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, value])

  const handleFilter = useCallback(val => {
    setValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })
  }, [])

  // const handleEditClick = () => {
  //   router.push(`/area/editarea?id=${area.id}`)
  // }
  const handleOpenDeleteNotSoft = id => {
    setOpenDelete(true)
    setTopicDeleteId(id)
  }

  const updatePaymentStatus = async (id, newStatus) => {
    try {
      setDeleteLoading(true)
      if (id !== '' && id !== undefined && id !== null) {
        const response = await axios.put(
          `${baseUrl}/api/topics/${id}`,
          {
            is_active: newStatus
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        if (response?.status === 200) {
          toast.success('Delete Successfully')
          setDeleteLoading(false)
          fetchData()
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.message)
      setDeleteLoading(false)
    }
  }

  const changeRowDataKeys = data => {
    const newArr = data?.map(obj => {
      const newObj = {}

      //You have to add a condition on the Object key name and perform your actions

      Object.keys(obj).forEach(key => {
        if (key === '_id') {
          newObj._id = obj._id
        } else if (key === 'name') {
          newObj.name = {
            ar: obj.name?.ar || '',
            en: obj.name?.en || ''
          }
        } else if (key === 'createdAt') {
          newObj.createdAt = obj?.createdAt
        } else if (key === 'is_active') {
          newObj.is_active = obj?.is_active
        } else {
          newObj[key] = obj[key]
        }
      })
      let keys = []
      Object.keys(newObj).forEach(key => {
        keys.push(key)
      })
      const order = ['_id', 'name', 'createdAt', 'is_active']

      const newOrderdObj = order.reduce((obj, key) => {
        if (!newObj[key]) {
          obj[key] = 'N/A'
        } else {
          obj[key] = newObj[key]
        }

        return obj
      }, {})

      return newOrderdObj
    })

    return newArr
  }
  const onBtnExport = () => convertJsonToExcel(changeRowDataKeys(data), 'Topics')

  const handleDeleteTopicsNotSoft = async () => {
    try {
      setIsDeleteLoading(true)
      if (topicDeleteId !== '' && topicDeleteId !== undefined && topicDeleteId !== null) {
        const response = await axios.delete(
          `${baseUrl}/api/topics/${topicDeleteId}`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        if (response?.status === 200) {
          toast.success('Topic Delete Successfully')
          setIsDeleteLoading(false)
          setOpenDelete(false)
          fetchData()
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.message)
      setIsDeleteLoading(false)
    }
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 100,
      headerClassName: 'super-app-theme--header',
      field: 'isActive',
      headerName: 'Is Active',
      renderHeader: () => (
        <Typography
          sx={{
            fontSize: '18px',
            color: '#161616',
            fontWeight: 700,
            lineHeight: '23.4px'
          }}
        >
          {'Is Active'}
        </Typography>
      ),
      renderCell: ({ row }) => (
        <Switch
          {...label}
          checked={row?.is_active}
          onChange={() => {
            const newStatus = !row?.is_active
            updatePaymentStatus(row?.id, newStatus) // Call the update function
          }}
        />
      )
    },
    {
      flex: 0.15,
      minWidth: 100,
      headerClassName: 'super-app-theme--header',
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderHeader: () => (
        <Typography
          sx={{
            fontSize: '18px',
            color: '#161616',
            fontWeight: 700,
            lineHeight: '23.4px'
          }}
        >
          {'Actions'}
        </Typography>
      ),
      renderCell: ({ row }) => {
        const handleEditClick = id => {
          setEditTopicId(id)
          setOpenEdit(true)
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Delete topic '>
              <IconButton
                size='small'
                sx={{ color: 'text.secondary' }}
                onClick={() => handleOpenDeleteNotSoft(row?.id)}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title='Delete topic soft'>
              <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDeleteTopics(row.id)}>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip> */}
            <Tooltip title='Edit'>
              <IconButton size='small' onClick={() => handleEditClick(row?.id)}>
                <Icon icon='tabler:edit' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{ m: '0 !important' }} />
          <Box
            sx={{
              py: 4,
              px: 6,
              rowGap: 2,
              columnGap: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant='h1' sx={{ fontSize: '2rem', fontWeight: 400, color: '#000' }}>
                Topics
              </Typography>
            </Box>

            <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <CustomTextField
                value={value}
                sx={{ mr: 4 }}
                placeholder='Search'
                InputProps={{
                  startAdornment: <Icon icon={'mynaui:search'} color={'#64656980'} fontSize={'1.6rem'} />
                }}
                onChange={e => handleFilter(e.target.value)}
              />
              <Button
                color='secondary'
                variant='outlined'
                sx={{
                  paddingY: '0.9rem',
                  borderColor: '#64656980',
                  color: '#64656980',
                  marginRight: 2
                }}
                startIcon={<Icon icon='tabler:upload' />}
                onClick={() => onBtnExport()}
                disabled={!data}
              >
                Export
              </Button>
              {/* <Select
                IconComponent={'span'}
                displayEmpty
                sx={{
                  paddingRight: 0,
                  marginRight: 4,

                  '& .MuiSelect-select': {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    paddingRight: '1.5rem !important',
                    paddingLeft: '0rem !important'
                  },

                  '& .MuiSelect-select-MuiInputBase-input-MuiInputBase-input.MuiSelect-select': {
                    minWidth: '4rem !important',
                    padding: '14.5px 14px'
                  }

                  // '& .MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {

                  // },
                }}
                onChange={e => setStatusValue(e?.target?.value)}
                defaultValue={'Filter'}
                renderValue={value => {
                  return (
                    <Box sx={{ display: 'flex', gap: 1, paddingLeft: '0px', color: '#64656980' }}>
                      <Icon icon='hugeicons:menu-08' />
                      {value}
                    </Box>
                  )
                }}
              >
                <MenuItem value='true'>True</MenuItem>
                <MenuItem value='false'>False</MenuItem>
              </Select> */}
              <Button
                variant='contained'
                sx={{
                  '& svg': { mr: 2 },
                  py: '13.2px',
                  px: '34.5px',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#fff',
                  backgroundColor: '#1068A8',
                  '&:hover': {
                    backgroundColor: '#1174bb'
                  }
                }}
                onClick={handleAddClickOpen}
              >
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add Topics
              </Button>
            </Box>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <DataGrid
            autoHeight
            pagination
            rowHeight={62}
            rows={data ?? []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            loading={loading}
            paginationMode='server'
            rowCount={totalCounts}
            sx={{
              '& .super-app-theme--header': {
                backgroundColor: '#EFF5FA'
              }
            }}

            // onRowSelectionModelChange={rows => setSelectedRows(rows)}
          />
        </Card>
      </Grid>
      <AddTopics open={openAdd} setOpenAdd={setOpenAdd} fetchData={fetchData} />
      <EditTopic open={openEdit} editTopicId={editTopicId} setOpenEdit={setOpenEdit} fetchData={fetchData} />
      <DeleteData
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        text={'Are you sure to delete this topic?'}
        fetchData={fetchData}
        title={'Delete Topic'}
        isDeleting={isDeleteLoading}
        deleteSubmit={handleDeleteTopicsNotSoft}
      />
    </Grid>
  )
}

export default Topics