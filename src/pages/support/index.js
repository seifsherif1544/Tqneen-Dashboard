import React from 'react'
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

import { Button } from '@mui/material'

import axios from 'axios'

// import EditArea from './editarea'
// import AddArea from './addarea'
import { fetchData } from 'src/store/apps/user'
import baseUrl from 'src/API/apiConfig'

import toast from 'react-hot-toast'
import AddSupport from './addSupport'
import EditSupport from './editSupport'

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
    headerName: 'ID',
    renderCell: ({ row }) => <Typography component={LinkStyled} href='#'>{`#${row?.id}`}</Typography>
  },

  {
    flex: 0.2,
    minWidth: 100,
    field: 'contactNumber',
    headerName: 'Contact Number',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.contactNumber}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'is_active',
    headerName: 'Active',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.is_active ? 'Active' : 'NotActive'}</Typography>
  },

]

/* eslint-enable */
const Support = () => {
  // ** State
  const [data, setDates] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editTopicId, setEditTopicId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle Edit dialog
  const handleAddClickOpen = () => setOpenAdd(true)
  const handleEditClickOpen = () => setOpenEdit(true)

  const router = useRouter()

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/support`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = response.data
      setDates(data)
      console.log(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // const handleEditClick = () => {
  //   router.push(`/area/editarea?id=${area.id}`)
  // }
  const handleDeleteTopics = async (id) => {
    try {
      setDeleteLoading(true);
      if (id !== "" && id !== undefined && id !== null) {
        const response = await axios.put(`${baseUrl}/api/support/${id}`, {
          is_active: false
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (response?.status === 200) {
          toast.success("Delete Successfully");
          setDeleteLoading(false);
          fetchData();
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.message);
      setDeleteLoading(false);
    }
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => {
        const handleEditClick = id => {
          setEditTopicId(id)
          setOpenEdit(true)
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Delete Support'>
              <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDeleteTopics(row?.id)}>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit Support'>
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
        <Box
          sx={{
            py: 0,
            px: 0,
            display: 'flex',
            float: 'right'
          }}
        >
          <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap' }}>
            <Button variant='contained' sx={{
              '& svg': { mr: 2 }, py: "13.2px",
              px: "34.5px",
              fontSize: "18px",
              fontWeight: 700,
              color: "#fff",
              backgroundColor: "#1068A8",
              '&:hover': {
                backgroundColor: "#1174bb"
              }
            }} onClick={handleAddClickOpen}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              Add New Support
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <DataGrid
            autoHeight
            pagination
            rowHeight={62}
            rows={data ?? []}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}

          // onRowSelectionModelChange={rows => setSelectedRows(rows)}
          />
        </Card>
      </Grid>
      <AddSupport open={openAdd} onClose={() => { setOpenAdd(false) }} fetchData={fetchData} />
      <EditSupport open={openEdit} editTopicId={editTopicId} onClose={() => { setOpenEdit(false) }} fetchData={fetchData} />
    </Grid>
  )
}

export default Support
