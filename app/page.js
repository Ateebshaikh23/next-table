"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Checkbox,
  Box,
  TextField,
  InputAdornment,
  Toolbar,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  TableSortLabel,
} from "@mui/material";
import axios from "axios";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/users");
      setUsers(res.data);
    };
    loadUsers();
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  return (
    <Container>
      <TextField
        placeholder="Enter Your Name"
        margin="normal"
        label="Search Here"
        className="px-3"
      />
      <Toolbar />
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        {selectedUser && (
          <List>
            <Toolbar />
            <ListItem>
              <ListItemText primary={`User Name: ${selectedUser.name}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Email: ${selectedUser.email}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Phone: ${selectedUser.phone}`} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Company Name: ${selectedUser.company.name}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Website Name: ${selectedUser.website}`} />
            </ListItem>
          </List>
        )}
      </SwipeableDrawer>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell><TableSortLabel>Name</TableSortLabel> </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Website</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map((user) => (
                <TableRow key={user.id} >
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(user)}>{user.name}</TableCell>
                  <TableCell onClick={() => handleRowClick(user)}>{user.email}</TableCell>
                  <TableCell onClick={() => handleRowClick(user)}>{user.phone}</TableCell>
                  <TableCell onClick={() => handleRowClick(user)}>{user.company.name}</TableCell>
                  <TableCell onClick={() => handleRowClick(user)}>{user.website}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 7, 10, 25, 50]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    </Container>
  );
}

