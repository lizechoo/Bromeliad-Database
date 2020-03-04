app.factory 'SpeciesExportF', ->
  SpeciesExportF = {}

  SpeciesExportF.unparseSpecies = (species, type) ->
    traits = {}
    for s in species
      console.log s.traits
      if s.traits and Object.keys(s.traits).length > 0
        for trait, value of s.traits
          traits[trait] = true

    if type is 'csv' or type is 'tsv'
      obj = []
      for s in species
        obj.push _flattenTraitsNames s, traits
      if type is 'csv'
        options = delimiter: ','
      else
        options = delimiter: '\t'
      return Papa.unparse obj, options
    else
      return JSON.stringify species, null, '\t'

  _flattenTraitsNames = (species, traits) ->
    obj = {}
    for k, v of species
      if k is 'names'
        i = 0
        for name in v
          obj["name#{i}"] = name
          i++
      else if k is 'traits'
        for type of traits
          if v[type]?
            obj[type] = v[type]
          else
            obj[type] = 'NA'
      else
        obj[k] = v
    return obj

  return SpeciesExportF
