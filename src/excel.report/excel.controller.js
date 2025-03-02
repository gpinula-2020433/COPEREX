import ExcelJS from 'exceljs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import Company from '../company/company.model.js'
//Generar Excel de compañías

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
export const generateExcel = async(req, res)=>{
    try {
        const companies = await Company.find()
        //Revisamos si existe alguna empresa registrada
        if (companies.length === 0){
            return res.status(404).json(
                {
                    succes: false,
                    message: 'There are no companies'
                }
            )
        }
        //Creamos un nuevo libro de Excel y añadimos la hoja Companies
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Report_Companies')
        //Definimos las columnas que tendremos en el excel
        worksheet.columns = [
            {header: 'Nombre', key: 'name', width: 20},
            {header: 'Descripción', key: 'description', width: 50},
            {header: 'Nivel de impacto', key: 'levelOfImpact', width: 20},
            {header: 'Años de trayectoria', key: 'yearsOfTrajectory', width: 20},
            {header: 'Categoria', key: 'category', width: 20 }
        ]

        //Aplicamos estilo a la cabecera
        const headerRow = worksheet.getRow(1) //Fila de la cabecera
        for (let i = 1; i <= 5; i++){ //De la primera a la quinta columna
            const cell = headerRow.getCell(i)
            cell.font = { bold: true }
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00B0F0' }
            }
        }
        headerRow.commit() //Confirmamos cambios

        //Añadimos los datos al archivo, filas
        companies.forEach((company)=>{
            worksheet.addRow(
                {
                    name: company.name,
                    description: company.description,
                    levelOfImpact: company.levelOfImpact,
                    yearsOfTrajectory: company.yearsOfTrajectory,
                    category: company.category
                })
        })
        //Obtenemos la fecha
        const currentDate = new Date()
        //Extraemos los valores que necesitamos
        //El padStart sirve para que si devuelve 5, rellena el espacio con 0 ya que pide 2 numeros
        const day = currentDate.getDate().toString().padStart(2, '0')
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
        const year = currentDate.getFullYear()
        const hours = currentDate.getHours().toString().padStart(2, '0')
        const minutes = currentDate.getMinutes().toString().padStart(2, '0')
        const seconds = currentDate.getSeconds().toString().padStart(2, '0')
        const formattedDate = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`
        
        const fileName = `ReportOfCompanies_${formattedDate}Companies.xlsx` //El nombre del archivo
        //Defimimos la ruta donde se guardara
        const filePath = join(CURRENT_DIR, '..', 'generated', 'excel.company', fileName)
        
        //Escribimos el archivo Excel en la ruta que creamos
        await workbook.xlsx.writeFile(filePath);
        //Configuramos las cabeceras HTTP para la descarga del archivo, navegador 
        console.log('File saved at:', filePath);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${fileName}`
        )
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        // Enviamos el archivo como respuesta al cliente
        res.download(
            filePath, 
            (err)=>{
                if (err) {
                    console.error('Error sending file:', err);
                    return res.status(500).send({ message: 'Error sending file' })
                }
            }
        )
    } catch (err) {
        console.error('Error generating report:', err)
        return res.status(500).send(
            {
                succes: false,
                message: 'Error generating report in Excel'
            }
        )
    }
}