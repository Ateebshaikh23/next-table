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
  Checkbox,
  TextField,
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
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [checked, setChecked] = useState([]);

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const sortComparator = (a, b, event) => {
    if (a[orderBy] < b[orderBy]) {
      return order === "asc" ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  };

  const userSort = [...users].sort(sortComparator);

  const handleCheck = (e) => {
    if (e.target.checked) {
      const selected = users.map((user) => user.id);
      setChecked(selected);
      return;
    }
    setChecked([]);
  };

  const handleCheckBox = (event, id) => {
    const selectedIndex = checked.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(checked, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(checked.slice(1));
    } else if (selectedIndex === checked.length - 1) {
      newSelected = newSelected.concat(checked.slice(0, selectedIndex));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        checked.slice(0, selectedIndex),
        checked.slice(selectedIndex + 1)
      );
    }
    setChecked(newSelected);
  };

  const isSelected = (id) => checked.indexOf(id) !== -1;

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
        className="w-2/4 "
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ width: 600, justifyContent: "center" }}
        PaperProps={{ sx: { width: 600, justifyContent: "center" } }}
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
                <Checkbox
                  indeterminate={
                    checked.length > 0 && checked.length < users.length
                  }
                  checked={users.length > 0 && checked.length === users.length}
                  onChange={handleCheck}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={(event) => {
                    handleRequestSort(event, "name");
                  }}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "email"}
                  direction={orderBy === "email" ? order : "asc"}
                  onClick={(event) => {
                    handleRequestSort(event, "email");
                  }}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "Phone"}
                  direction={orderBy === "Phone" ? order : "asc"}
                  onClick={(event) => {
                    handleRequestSort(event, "Phone");
                  }}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "Company"}
                  direction={orderBy === "Company" ? order : "asc"}
                  onClick={(event) => {
                    handleRequestSort(event, "Company");
                  }}
                >
                  Company
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "website"}
                  direction={orderBy === "website" ? order : "asc"}
                  onClick={(event) => {
                    handleRequestSort(event, "website");
                  }}
                >
                  Website
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userSort
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map((user) => {
                const isItemSelected = isSelected(user.id);
                return (
                  <TableRow
                    key={user.id}
                    checked={isItemSelected}
                    // onClick={(event) => handleRowClick(user)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => handleCheckBox(event, user.id)}
                      />
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(user)}>
                      {user.name}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(user)}>
                      {user.email}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(user)}>
                      {user.phone}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(user)}>
                      {user.company.name}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(user)}>
                      {user.website}
                    </TableCell>
                  </TableRow>
                );
              })}
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
