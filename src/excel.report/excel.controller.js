import ExcelJS from 'exceljs'
import fs from 'fs'
import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import Company from '../company/company.model.js'

const { Response } = express
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export const createExcel = async (req, res = Response) => {
    try {
        const companies = await Company.find()
        if (companies.length === 0) {
            return res.status(404).json({ message: 'There are no registered companies' })
        }

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Companies')
        worksheet.columns = [
            { header: 'Nombre', key: 'name', width: 30 },
            { header: 'Teléfono', key: 'phone', width: 15 },
            { header: 'Impacto', key: 'impactLevel', width: 20 },
            { header: 'Años de Experiencia', key: 'yearsExperience', width: 20 },
            { header: 'Categoría', key: 'category', width: 20 },
        ]
        companies.forEach((company) => {
            worksheet.addRow({
                name: company.name,
                phone: company.phone,
                impactLevel: company.impactLevel,
                yearsExperience: company.yearsExperience,
                category: company.category,
            })
        })
        const fileName = `Repor_Companies_${Date.now()}.xlsx`
        const filePath = path.join(__dirname, '..', 'generated', 'excel.company', fileName)
        
        await workbook.xlsx.writeFile(filePath);
        console.log('File saved at:', filePath);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${fileName}`
        )
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return res.status(500).json({ message: 'Error sending file' })
            }
        })
    } catch (err) {
        console.error('Error generating report:', err)
        return res.status(500).json({ message: 'Error generating report in Excel'})
    }
}