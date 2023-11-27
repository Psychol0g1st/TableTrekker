import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { deepCopy } from '../utils/deep-copy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Gender } from '../enums/gender';

const Allatok = () => {
  const [entities, setEntity] = useState([]);
  const [species, setSpecies] = useState([]);
  const [climates, setClimates] = useState([]);
  const [cages, setCages] = useState([]);
  const [diets, setDiets] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const formDefinition = { // ures form az adott entitasnak
    id: '',
    name: '',
    speciesId: '',
    climateId: '',
    cageId: '',
    dietId: '',
    dateOfBirth: new Date().toISOString().slice(0, 10),
    dateOfArrival: new Date().toISOString().slice(0, 10),
    gender: 'Hím',
    

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
      key: 'diet.substance.name',
      label: 'Táplálék',
    },
    {
      key: 'dateOfBirth',
      label: 'Születési dátum',
      formatter: (value) => new Date(value).toLocaleDateString().substring(0, 10)
    },
    {
      key: 'dateOfArrival',
      label: 'Érkezésési dátum',
      formatter: (value) => new Date(value).toLocaleDateString().substring(0, 10)
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
    if(formValues?.speciesId){
      formValues.species = species.find(species => species.id === parseInt(formValues.speciesId))
      delete formValues.speciesId
    }
    if(formValues?.climateId){
      formValues.climate = climates.find(climate => climate.id === parseInt(formValues.climateId))
      delete formValues.climateId
    }
    if(formValues?.cageId){
      formValues.cage = cages.find(cage => cage.id === parseInt(formValues.cageId))
      delete formValues.cageId
    }
    if(formValues?.dietId){
      formValues.diet = diets.find(diet => diet.id === parseInt(formValues.dietId))
      delete formValues.dietId
    }
    if (selectedEntity) {
      const res = await axios.put(`http://localhost:8082/animals/update/` + formValues.id, formValues)
      if(res.status === 200) {
        const updatedEntities = entities.map((entity) =>
        entity.id === selectedEntity.id ? { ...entity, ...res.data } : entity);
        setEntity(updatedEntities);
      }
    } else {
      // Create new entity
      const res = await axios.post(`http://localhost:8082/animals/add`, formValues)
      if(res.status === 200){
        setEntity([...entities, res.data]);
      }
    }
    closeSidebar();
  }
  const handleRowChange = (e) => {
    e.speciesId = e.species?.id
    e.climateId = e.climate?.id
    e.cageId = e.cage?.id
    e.dietId = e.diet?.id
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
    const fetchDietsData = async () => {
      try {
        const response = await axios.get('http://localhost:8082/animaldiets/getall');
        setDiets(response.data);
        console.log(response.data)
      } catch (error) {
        console.error(error);
      }
    }
    fetchSpeciesData();
    fetchData();
    fetchClimatesData();
    fetchCagesData();
    fetchDietsData();
  }, []);

  const handleDelete = async () => {
    try{
      const res = await axios.delete(`http://localhost:8082/animals/delete/` + formValues.id)
      if(res.status === 200) {
        const updatedEntities = entities.filter((entity) => entity.id !== selectedEntity.id);
        setEntity(updatedEntities);
        closeSidebar();
      }
    } catch (error) {
      alert("Függőségek miatt nem lehet törölni!")
      console.error(error);
    }
  }

  return (
    <Layout>
      <div className='d-flex mb-3'>
        <h1>Állatok</h1>
        <button className='ms-auto btn btn-brown icon' onClick={openSidebar}><FontAwesomeIcon icon={faPlus} /></button>
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
                  <div className='mb-3'>
                        <label htmlFor="type" className="form-label">
                            Nem
                        </label>
                        <select 
                        className="form-select"
                        id="type"
                        name="type"
                        value={formValues.gender}
                        onChange={handleInputChange}
                        >
                            {Object.keys(Gender).map((key) => (
                                  <option key={Gender[key]} value={Gender[key]}>
                                      {Gender[key]}
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
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Válassz étrendet
                    </label>
                    <select
                      className="form-select"
                      id="diet"
                      name="dietId"
                      value={formValues.dietId}
                      onChange={handleInputChange}
                    >
                      <option value="">Válassz étrendet</option>
                      {diets.map((diet) => (
                        <option key={diet.id} value={diet.id}>
                          {diet.substance.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Ketrec
                    </label>
                    <select
                      className="form-select"
                      id="cage"
                      name="cageId"
                      value={formValues.cageId}
                      onChange={handleInputChange}
                    >
                      <option value="">Válassz ketrecet</option>
                      {cages.map((cage) => (
                        <option key={cage.id} value={cage.id}>
                          {cage.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  <div className='d-flex'>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    {selectedEntity && (
                      <button
                        type="button"
                        className="btn btn-danger ms-auto"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                    )}
                  </div>
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
