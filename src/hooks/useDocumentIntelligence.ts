import { useState, useCallback } from 'react';
import documentIntelligenceService from '../services/documentIntelligenceService';

// Document Classification Hook
export const useDocumentClassification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [classification, setClassification] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const classifyDocument = useCallback(async (documentId: string, options?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.classifyDocument(documentId, options);
      setClassification(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Classification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const trainCustomClassifier = useCallback(async (trainingData: any[], modelConfig: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.trainCustomClassifier(trainingData, modelConfig);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Training failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { classifyDocument, trainCustomClassifier, isLoading, classification, error };
};

// Smart Recommendations Hook
export const useSmartRecommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = useCallback(async (documentId: string, context?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.generateSmartRecommendations(documentId, context);
      setRecommendations(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recommendations failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const implementRecommendation = useCallback(async (recommendationId: string, parameters?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.implementRecommendation(recommendationId, parameters);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Implementation failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generateRecommendations, implementRecommendation, isLoading, recommendations, error };
};

// Workflow Automation Hook
export const useWorkflowAutomation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const createWorkflow = useCallback(async (workflow: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.createWorkflowAutomation(workflow);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Workflow creation failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getWorkflows = useCallback(async (filters?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.getWorkflowAutomations(filters);
      setWorkflows(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Workflows retrieval failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testWorkflow = useCallback(async (workflowId: string, testDocuments: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.testWorkflowAutomation(workflowId, testDocuments);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Workflow testing failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createWorkflow, getWorkflows, testWorkflow, isLoading, workflows, error };
};

// Contextual Analysis Hook
export const useContextualAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = useCallback(async (documentId: string, options?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.performContextualAnalysis(documentId, options);
      setAnalysis(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeBatch = useCallback(async (documentIds: string[], analysisType: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.analyzeDocumentBatch(documentIds, analysisType);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch analysis failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { performAnalysis, analyzeBatch, isLoading, analysis, error };
};

// Document Templates Hook
export const useDocumentTemplates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const createTemplate = useCallback(async (template: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.createDocumentTemplate(template);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Template creation failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTemplates = useCallback(async (filters?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.getDocumentTemplates(filters);
      setTemplates(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Templates retrieval failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyTemplate = useCallback(async (documentId: string, templateId: string, customizations?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentIntelligenceService.applyTemplate(documentId, templateId, customizations);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Template application failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createTemplate, getTemplates, applyTemplate, isLoading, templates, error };
}; 