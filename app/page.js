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
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [checked, setChecked] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: (users) => users,
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axios.get(
          "https://jsonplaceholder.typicode.com/comments"
        );

        localStorage.setItem("users", JSON.stringify(res.data));
        setUsers(res.data);
      } catch (error) {
        console.error("Error loading users:", error);
      }
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

  const sortComparator = (a, b) => {
    if (orderBy === "id") {
      return order === "asc" ? a.id - b.id : b.id - a.id;
    }
    if (a[orderBy] < b[orderBy]) {
      return order === "asc" ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  };

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

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (users) => {
        if (target.value === "") return users;
        else
          return users.filter((x) =>
            x.name.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  const filteredUsers = filterFn.fn(users);
  const sortedUsers = filteredUsers.sort(sortComparator);
  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleDelete = (userId) => {
    const updateUsers = users.filter((user) => user.id !== userId);
    setUsers(updateUsers);
    localStorage.setItem("users", JSON.stringify(updateUsers));
  };

  return (
    <Container>
      <TextField
        placeholder="Enter The Name"
        margin="normal"
        label="Search Here"
        className="px-3"
        onChange={handleSearch}
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
              <ListItemText primary={`id: ${selectedUser.id}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`User Name: ${selectedUser.name}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Email: ${selectedUser.email}`} />
            </ListItem>

            <ListItem>
              <ListItemText primary={`body Name: ${selectedUser.body}`} />
            </ListItem>
            <ListItem style={{ paddingTop: "50px" }}>
              <Button
                variant="contained"
                style={{ backgroundColor: "red" }}
                onClick={() => {
                  handleDelete(selectedUser.id);
                  setOpen(false);
                }}
              >
                Delete
              </Button>
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
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={(event) => {
                    handleRequestSort(event, "id");
                  }}
                >
                  ID
                </TableSortLabel>
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
                  E-mail
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "body"}
                  direction={orderBy === "body" ? order : "asc"}
                  onClick={(event) => {
                    handleRequestSort(event, "body");
                  }}
                >
                  Body
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Button
                  color="warning"
                  variant="outlined"
                  endIcon={<DeleteIcon />}
                >
                  delete
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => {
              const isItemSelected = isSelected(user.id);
              return (
                <TableRow key={user.id} checked={isItemSelected}>
                  <TableCell>
                    <Checkbox
                      checked={isItemSelected}
                      onChange={(event) => handleCheckBox(event, user.id)}
                    />
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(user)}>
                    {user.id}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(user)}>
                    {user.name}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(user)}>
                    {user.email}
                  </TableCell>

                  <TableCell onClick={() => handleRowClick(user)}>
                    {user.body}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "red" }}
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 75]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    </Container>
  );
}
