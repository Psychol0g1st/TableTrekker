import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { deepCopy } from '../utils/deep-copy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Allatok = () => {
  const [entities, setEntity] = useState([]);
  const [species, setSpecies] = useState([]);
  const [climates, setClimates] = useState([]);
  const [cages, setCages] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const formDefinition = { // ures form az adott entitasnak
    id: '',
    name: '',
    speciesId: '',
    climateId: '',
    cageId: '',
    dateOfBirth: new Date().toISOString().slice(0, 10),
    dateOfArrival: new Date().toISOString().slice(0, 10),
    gender: '',
    

  }
  const [formValues, setFormValues] = useState(deepCopy(formDefinition));
  const dataTableColumns = [
    {
    key: 'id',
    label: 'ID',
    },
    {
      key: 'species.name',
      label: 'Faj',
    },
    {
      key: 'name',
      label: 'Név',
    },
    {
      key: 'gender',
      label: 'Nem',
    },
    {
      key: 'climate.name',
      label: 'Éghajlat',
    },
    {
      key: 'cage.name',
      label: 'Ketrec',
    },
    {
      key: 'dateOfBirth',
      label: 'Születési dátum',
    },
    {
      key: 'dateOfArrival',
      label: 'Érkezésési dátum',
    },
    // {
    //   key: 'healthRecords',
    //   label: 'Egészségügyi nyilvántartások',
    // }
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

  const handleSave = () => {
    if (selectedEntity) {
      const updatedEntities = entities.map((entity) => {
        const data = entity.id === selectedEntity.id ? { ...entity, ...formValues } : entity
        if(data?.speciesId){
          data.species = species.find(species => species.id === data.speciesId).name
          delete data.speciesId
        }

        return data
      });
      setEntity(updatedEntities);
      axios.put(`http://localhost:8082/animals/update/` + formValues.id, formValues)
    } else {
      // Create new entity
      const data = { id: entities.length + 1, ...formValues };
      if(data?.speciesId){
          data.species = species.find(species => species.id === data.speciesId).name
          delete data.speciesId
        }
      setEntity([...entities, data]);
      axios.post(`http://localhost:8082/animals/add`, data)
    }
    closeSidebar();
  }
  const handleRowChange = (e) => {
    e.speciesId = e.species?.id
    setSelectedEntity(e);
    setFormValues(e);
    openSidebar();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8082/animals/getall');
        setEntity(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchSpeciesData = async () => {
      try {
        const response = await axios.get('http://localhost:8082/species/getall');
        setSpecies(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchClimatesData = async () => {
      try {
        const response = await axios.get('http://localhost:8082/climates/getall');
        setClimates(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    const fetchCagesData = async () => {
      try {
        const response = await axios.get('http://localhost:8082/cages/getall');
        setCages(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSpeciesData();
    fetchData();
    fetchClimatesData();
    fetchCagesData();
  }, []);

  return (
    <Layout>
      <div className='d-flex'>
        <h1>Állatok</h1>
        <button className='ms-auto btn btn-primary icon' onClick={openSidebar}><FontAwesomeIcon icon={faPlus} /></button>
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
                    <label htmlFor="description" className="form-label">
                      Faj
                    </label>
                    <select
                      className="form-select"
                      id="species"
                      name="speciesId"
                      value={formValues.speciesId}
                      onChange={handleInputChange}
                    >
                      <option value="">Válassz egy fajt</option>
                      {species.map((species) => (
                        <option key={species.id} value={species.id}>
                          {species.name}
                        </option>
                      ))}
                    </select>
                  </div>
                    <div className="mb-3">
                      <label htmlFor="description" className='form-label'>Éghajlat</label> 
                    <select
                      className='form-select'
                      id='climateId'
                      name='climateId'
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
                    {/* <input
                      type="text"
                      className="form-control"
                      id="species"
                      name="species"
                      value={formValues.species}
                      onChange={handleInputChange}
                    /> */}
                  </div>
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
                    <label htmlFor="value" className="form-label">
                      Nem
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="gender"
                      name="gender"
                      value={formValues.gender}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Éghajlat
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="climate"
                      name="climate"
                      value={formValues.climate}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* TODO
                   <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Ketrec
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cage.name"
                      name="cage.name"
                      value={formValues.cage.name}
                      onChange={handleInputChange}
                    />
                  </div>  */}
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                      Születési dátum
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formValues.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                      Érkezésési dátum
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="dateOfArrival"
                      name="dateOfArrival"
                      value={formValues.dateOfArrival}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* <div className="mb-3">
                    <label htmlFor="fing" className="form-label">
                      Egészségügyi nyilvántartások
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="healthRecords"
                      name="healthRecords"
                      value={formValues.healthRecords}
                      onChange={handleInputChange}
                    />
                  </div> */}
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

export default Allatok;
