import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { deepCopy } from '../utils/deep-copy';

const Ketrecek = () => {
  const [entities, setEntity] = useState([]);
  const [climates, setClimates] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const formDefinition = { // ures form az adott entitasnak
    id: '',
    name: '',
    climateId: 0,
    positionX: '',
    positionY: '',
  }
  const [formValues, setFormValues] = useState(deepCopy(formDefinition));
  const dataTableColumns = [
    {
      key: 'id',
      label: 'ID',
      },
      {
        key: 'name',
        label: 'Név'
      },
      {
          key: 'climate.name',
          label: 'Éghajlat',
      },
      {
          key: 'positionX',
          label: 'Pizíció X',
      },
      {
          key: 'positionY',
          label: 'Pizíció Y',
        },
    ]
  
  const openSidebar = () => {
    setIsSidebarOpen(true);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setFormValues(deepCopy(formDefinition));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSave = async () => {
    if (selectedEntity) {
      if(formValues.climateId) {
        formValues.climate = climates.find((climate) => climate.id === parseInt(formValues.climateId));
        delete formValues.climateId;
      }
      const updatedEntities = entities.map((entity) =>
        entity.id === selectedEntity.id ? { ...entity, ...formValues } : entity
      );
      setEntity(updatedEntities);
      const res = await axios.put(`http://localhost:8082/cages/update/` + formValues.id, formValues)
      if(res.status === 200) {
        setEntity(res.data);
      }
    } else {
      // Create new entity
      if(formValues.climateId) {
        formValues.climate = climates.find((climate) => climate.id === parseInt(formValues.climateId));
        delete formValues.climateId;
      }
      const newEntity = { id: entities.length + 1, ...formValues };
      const res = await axios.post(`http://localhost:8082/cages/add`, newEntity)
      if(res.status === 200) {
        setEntity([...entities, res.data]);
      }
    }
    console.log("save", formValues)
    closeSidebar();
  }
  const handleRowChange = (e) => {
    e.climateId = e?.climate?.id ? e.climate.id : 0;
    console.log("row change ", e);
    setSelectedEntity(e);
    setFormValues(e);
    openSidebar();
  }

  useEffect(() => {
    console.log(formValues)
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8082/cages/getall');
        setEntity(response.data);
        console.log("data", response.data)
      } catch (error) {
        console.error(error);
      }
    };
    const fetchClimates = async () => {
      try {
        const response = await axios.get('http://localhost:8082/climates/getall');
        setClimates(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
    fetchClimates();
  }, []);

  useEffect(() => {
    console.log(formValues)
  }, [formValues]);


  return (
    <Layout>
      <div className='d-flex'>
        <h1>Ketrecek</h1>
        <button className='ms-auto btn btn-primary' onClick={openSidebar}>Új</button>
      </div>
      <div className="container-fluid flex-grow-1 d-flex">
        <div className="col flex-grow-1 d-flex">
            <DataTable data={entities} columns={dataTableColumns} onRowEvent={handleRowChange}/>
        </div>
        {isSidebarOpen && (
          <div className="ms-3 col-4">
            <div className="card">
              <div className="card-header">
                {selectedEntity ? 'Edit Entity' : 'Create New Entity'}
                <button
                  type="button"
                  className="btn-close float-end"
                  aria-label="Close"
                  onClick={closeSidebar}
                ></button>
              </div>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Név
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formValues.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Éghajlat
                    </label>
                    <select
                      className="form-select"
                      id="climateId"
                      name="climateId"
                      value={formValues.climateId}
                      onChange={handleInputChange}
                    >
                      <option value="">Válassz éghajlatot</option>
                      {climates.map((climate) => (
                        <option key={climate.id} value={climate.id}>
                          {climate.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="positionX" className="form-label">
                      Pozíció X
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="positionX"
                      name="positionX"
                      value={formValues.positionX}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="positionY" className="form-label">
                      Pozíció Y
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="positionY"
                      name="positionY"
                      value={formValues.positionY}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Ketrecek;
