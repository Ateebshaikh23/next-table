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
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { createTheme } from "@mui/material/styles";
import { z } from "zod";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [checked, setChecked] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = createTheme();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axios.get(
          "https://jsonplaceholder.typicode.com/comments"
        );
        const validData = res.data.map((comment) => scheme.parse(comment));
        localStorage.setItem("users", JSON.stringify(validData));
        setUsers(validData);
        setLoading(false);
      } catch (error) {
        setError("Error loading users.");
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Validation part
  const scheme = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    body: z.string(),
  });

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

  const handleNameSearch = (e) => {
    setNameFilter(e.target.value.toLowerCase());
  };

  const handleEmailSearch = (e) => {
    setEmailFilter(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(nameFilter) &&
      user.email.toLowerCase().includes(emailFilter)
    );
  });

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

  const handleBulkDelete = () => {
    const updateUsers = users.filter((user) => !checked.includes(user.id));
    setUsers(updateUsers);
    setChecked([]);
    localStorage.setItem("users", JSON.stringify(updateUsers));
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          [theme.breakpoints.between("md", "lg")]: {
            // backgroundColor: "blue",
            gap: "20px",
            display: "flex",
          },
          [theme.breakpoints.down("sm")]: {
            // backgroundColor:"black"
            display: "flex",
            flexDirection: "column",
            gap: "0",
          },
        }}
      >
        <TextField
          placeholder="Search by Name"
          margin="normal"
          label="Search by Name"
          className="px-3 "
          onChange={handleNameSearch}
          helperText="Enter the Name"
          sx={{
            [theme.breakpoints.down("sm")]: {
              fontSize: "12px",
            },
          }}
        />

        <TextField
          placeholder="Search by Email"
          margin="normal"
          label="Search by Email"
          className="px-3"
          onChange={handleEmailSearch}
          helperText="Enter the Email"
          sx={{
            [theme.breakpoints.down("sm")]: {
              fontSize: "12px",
            },
          }}
        />
      </Box>
      <Toolbar />
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: "50%" },
        }}
      >
        {selectedUser && (
          <List>
            <Toolbar />
            <ListItem>
              <ListItemText
                // sx={{
                //   [theme.breakpoints.down("sm")]: {
                //     backgroundColor: "red",
                //     fontSize:"9px"
                //   },
                // }}
                sx={{
                  fontSize: { xs: "9px", sm: "inherit" },
                  backgroundColor: { xs: "red", sm: "inherit" },
                }}
                primary={`ID: ${selectedUser.id}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary={`User Name: ${selectedUser.name}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Email: ${selectedUser.email}`} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Body: ${selectedUser.body}`}
                sx={{
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "10px",
                    backgroundColor: "lightblue",
                  },
                }}
              />
            </ListItem>
            <ListItem>
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
              <TableCell
                sx={{
                  [theme.breakpoints.down("md")]: {
                    padding: "0px",
                  },
                }}
              >
                <Checkbox
                  indeterminate={
                    checked.length > 0 && checked.length < users.length
                  }
                  checked={users.length > 0 && checked.length === users.length}
                  onChange={handleCheck}
                />
              </TableCell>

              <TableCell
                sx={{
                  [theme.breakpoints.down("md")]: {
                    padding: "0px",
                    // backgroundColor:"black"
                  },
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "8px",
                  },
                }}
              >
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

              <TableCell
                sx={{
                  [theme.breakpoints.down("md")]: {
                    padding: "0px",
                    // backgroundColor:"black"
                  },
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "8px",
                  },
                }}
              >
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

              <TableCell
                sx={{
                  [theme.breakpoints.down("md")]: {
                    padding: "0px",
                    // backgroundColor:"black"
                  },
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "8px",
                  },
                }}
              >
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

              <TableCell
                sx={{
                  [theme.breakpoints.down("md")]: {
                    padding: "0px",
                    // backgroundColor:"black"
                  },
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "8px",
                  },
                }}
              >
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

              <TableCell
                sx={{
                  [theme.breakpoints.down("md")]: {
                    padding: "0px",
                    // backgroundColor:"black"
                  },
                  [theme.breakpoints.down("sm")]: {
                    // backgroundColor:"black"
                  },
                }}
              >
                <Button
                  sx={{
                    [theme.breakpoints.down("sm")]: {
                      padding: "2px 4px",
                      marginRight: "3px",
                      fontSize: "8px",
                    },
                  }}
                  className="bulk-delete"
                  color="warning"
                  variant="outlined"
                  endIcon={<DeleteIcon />}
                  onClick={handleBulkDelete}
                  disabled={checked.length === 0}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => {
              const isItemSelected = isSelected(user.id);
              return (
                <TableRow key={user.id} selected={isItemSelected}>
                  <TableCell
                    sx={{
                      [theme.breakpoints.between("sm", "md")]: {
                        fontSize: "10px",
                        padding: "5px",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "8px",
                        padding: "1px",
                      },
                    }}
                  >
                    <Checkbox
                      checked={isItemSelected}
                      onChange={(event) => handleCheckBox(event, user.id)}
                    />
                  </TableCell>
                  <TableCell
                    onClick={() => handleRowClick(user)}
                    sx={{
                      [theme.breakpoints.between("sm", "md")]: {
                        fontSize: "10px",
                        padding: "5px",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "8px",
                        padding: "1px",
                      },
                    }}
                  >
                    {user.id}
                  </TableCell>
                  <TableCell
                    onClick={() => handleRowClick(user)}
                    sx={{
                      [theme.breakpoints.between("sm", "md")]: {
                        fontSize: "10px",
                        padding: "5px",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "8px",
                        padding: "1px",
                      },
                    }}
                  >
                    {user.name}
                  </TableCell>
                  <TableCell
                    onClick={() => handleRowClick(user)}
                    sx={{
                      [theme.breakpoints.between("sm", "md")]: {
                        fontSize: "10px",
                        padding: "5px",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "8px",
                        padding: "1px",
                      },
                    }}
                  >
                    {user.email}
                  </TableCell>
                  <TableCell
                    onClick={() => handleRowClick(user)}
                    sx={{
                      [theme.breakpoints.between("sm", "md")]: {
                        fontSize: "10px",
                        padding: "5px",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "8px",
                        padding: "1px",
                      },
                    }}
                  >
                    {user.body}
                  </TableCell>
                  <TableCell
                    sx={{
                      [theme.breakpoints.between("sm", "md")]: {
                        padding: "5px",
                        fontSize: "10px",
                      },
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "8px",
                        padding: "1px",
                      },
                    }}
                  >
                    <Button
                      color="secondary"
                      variant="outlined"
                      onClick={() => handleDelete(user.id)}
                      sx={{
                        [theme.breakpoints.between("sm", "md")]: {
                          padding: "2px 11px",
                          fontSize: "12px",
                          // backgroundColor:"black"
                        },
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "8px",
                          paddingLeft: "5px",
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Container>
  );
}
